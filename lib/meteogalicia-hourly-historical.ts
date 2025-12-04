/**
 * Servicio para consultar datos horarios históricos de estaciones meteorológicas
 * Nuevo servicio JSON de MeteoGalicia (2024)
 * Documentación: https://meteo-estaticos.xunta.gal/datosred/infoweb/meteo/docs/rss/JSON_EstacionHorariosHistoricos_es.pdf
 */

import type { WeatherStation, StationMeasurement } from '@/types/weather';
import { VIVEIRO_STATIONS, PARAMETER_NAMES, UNITS } from './meteogalicia-stations';
import { msToKmh } from './utils';

const METEOGALICIA_HOURLY_HISTORICAL = 'https://servizos.meteogalicia.gal/mgrss/observacion/datosHorariosEstacions.action';

/**
 * Parámetros para la consulta de datos horarios históricos
 */
export interface HourlyHistoricalParams {
  /** Fecha y hora inicial en formato DD/MM/YYYY HH:MM */
  startDateTime: string;
  /** Número de horas a consultar desde la fecha inicial */
  numHours: number;
  /** ID de la estación meteorológica */
  stationId: number;
}

/**
 * Dato horario de una estación meteorológica
 */
export interface HourlyStationData {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
  pressure?: number;
  solarRadiation?: number;
  [key: string]: string | number | undefined;
}

/**
 * Respuesta de la API de datos horarios históricos (formato real 2024)
 */
interface HourlyHistoricalResponse {
  dataIni: string;
  listHorarios: Array<{
    estacion: string;
    idEstacion: number;
    listaInstantes: Array<{
      instanteLecturaUTC: string;
      listaMedidas: Array<{
        codigoParametro: string;
        lnCodigoValidacion: number;
        nomeParametro: string;
        unidade: string;
        valor: number;
      }>;
    }>;
  }>;
}

/**
 * Obtiene datos horarios históricos de una estación
 * @param params Parámetros de consulta
 * @returns Array de datos horarios
 */
export async function getHourlyHistoricalData(
  params: HourlyHistoricalParams
): Promise<HourlyStationData[]> {
  try {
    const url = new URL(METEOGALICIA_HOURLY_HISTORICAL);
    url.searchParams.append('dataIni', params.startDateTime); // No hacer encode adicional, URL lo hace automáticamente
    url.searchParams.append('numHoras', params.numHours.toString());
    url.searchParams.append('idEst', params.stationId.toString());

    console.log('📡 Llamando a datos horarios históricos:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`⚠️ Error API históricos: ${response.status} ${response.statusText} - Retornando datos vacíos`);
      return [];
    }

    // Verificar que la respuesta es JSON antes de parsear
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn(`⚠️ API históricos retornó ${contentType} en lugar de JSON - Retornando datos vacíos`);
      return [];
    }

    const data: HourlyHistoricalResponse = await response.json();

    if (!data.listHorarios || data.listHorarios.length === 0) {
      console.warn('⚠️ API históricos retornó datos vacíos');
      return [];
    }

    const stationData = data.listHorarios[0];
    console.log('✅ Datos horarios recibidos:', {
      estacion: stationData.estacion,
      instantes: stationData.listaInstantes?.length,
    });

    return transformHourlyData(stationData);
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.warn('⚠️ Timeout obteniendo datos horarios históricos - Retornando datos vacíos');
    } else if (error instanceof SyntaxError) {
      console.warn('⚠️ Error parseando JSON de API históricos (probablemente HTML) - Retornando datos vacíos');
    } else {
      console.error('❌ Error obteniendo datos horarios históricos:', error);
    }
    // Retornar array vacío en lugar de lanzar error
    return [];
  }
}

/**
 * Obtiene datos horarios históricos de todas las estaciones de Viveiro
 * @param startDateTime Fecha y hora inicial (DD/MM/YYYY HH:MM)
 * @param numHours Número de horas
 * @returns Array de datos por estación
 */
export async function getViveiroHourlyHistoricalData(
  startDateTime: string,
  numHours: number = 24
): Promise<Map<number, HourlyStationData[]>> {
  const results = new Map<number, HourlyStationData[]>();

  await Promise.all(
    VIVEIRO_STATIONS.map(async (station) => {
      try {
        const data = await getHourlyHistoricalData({
          startDateTime,
          numHours,
          stationId: station.id,
        });
        results.set(station.id, data);
      } catch (error) {
        console.error(`Error obteniendo datos de estación ${station.name}:`, error);
        results.set(station.id, []);
      }
    })
  );

  return results;
}

/**
 * Obtiene datos de las últimas N horas desde ahora
 * NOTA: MeteoGalicia solo permite datos históricos con cierto retraso (varios meses)
 * Por eso usamos datos de hace ~2 meses como demostración
 * @param numHours Número de horas hacia atrás
 * @returns Map con datos por estación
 */
export async function getLastHoursData(numHours: number = 24): Promise<Map<number, HourlyStationData[]>> {
  // WORKAROUND: La API solo acepta fechas pasadas (con varios meses de retraso)
  // Usamos datos de hace 2 meses como ejemplo
  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 días atrás
  const startDate = new Date(twoMonthsAgo.getTime() - numHours * 60 * 60 * 1000);

  // Formatear a DD/MM/YYYY HH:MM
  const day = String(startDate.getDate()).padStart(2, '0');
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const year = startDate.getFullYear();
  const hours = String(startDate.getHours()).padStart(2, '0');
  const minutes = '00'; // Redondear a horas exactas

  const startDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

  console.log(`📅 Obteniendo datos históricos (${numHours}h desde ${startDateTime})`);

  return await getViveiroHourlyHistoricalData(startDateTime, numHours);
}

/**
 * Transforma los datos de la API al formato de la aplicación
 */
function transformHourlyData(stationData: HourlyHistoricalResponse['listHorarios'][0]): HourlyStationData[] {
  if (!stationData.listaInstantes || !Array.isArray(stationData.listaInstantes)) {
    return [];
  }

  // Transformar cada instante en un punto de datos
  const hourlyData: HourlyStationData[] = stationData.listaInstantes.map((instante) => {
    const dataPoint: HourlyStationData = {
      timestamp: instante.instanteLecturaUTC,
    };

    // Procesar cada medida
    instante.listaMedidas.forEach((medida) => {
      const value = medida.valor;
      const code = medida.codigoParametro;

      switch (code) {
        case 'TA_AVG_1.5m':
        case 'TA_AVG_2m':
          dataPoint.temperature = value;
          break;
        case 'HR_AVG_1.5m':
        case 'HR_AVG_2m':
          dataPoint.humidity = value;
          break;
        case 'PP_SUM_1.5m':
        case 'PP_SUM_2m':
          dataPoint.precipitation = value;
          break;
        case 'VV_AVG_10m':
        case 'VV_AVG_2m':
          // Convertir de m/s a km/h
          dataPoint.windSpeed = medida.unidade === 'm/s' ? msToKmh(value) : value;
          break;
        case 'DV_AVG_10m':
        case 'DV_AVG_2m':
          dataPoint.windDirection = value;
          break;
        case 'PA_AVG_1.5m':
        case 'PA_AVG_2m':
        case 'PR_AVG_1.5m':
          dataPoint.pressure = value;
          break;
        case 'RS_AVG_1.5m':
        case 'RS_AVG_2m':
          dataPoint.solarRadiation = value;
          break;
        default:
          // Guardar otros parámetros con su código original
          dataPoint[code] = value;
      }
    });

    return dataPoint;
  });

  // Ordenar por timestamp
  return hourlyData.sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

/**
 * Obtiene el nombre amigable de un parámetro
 */
export function getParameterName(code: string): string {
  return PARAMETER_NAMES[code] || code;
}

/**
 * Obtiene la unidad de medida de un parámetro
 */
export function getParameterUnit(code: string): string {
  return UNITS[code] || '';
}
