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
 * Respuesta de la API de datos horarios históricos
 */
interface HourlyHistoricalResponse {
  idEstacion: number;
  nombreEstacion: string;
  lat: number;
  lon: number;
  parametros: {
    codigo: string;
    nombre: string;
    unidade: string;
    valores: Array<{
      fecha: string;
      valor: number | string;
    }>;
  }[];
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
    });

    if (!response.ok) {
      throw new Error(`Error API históricos: ${response.status} ${response.statusText}`);
    }

    const data: HourlyHistoricalResponse = await response.json();

    console.log('✅ Datos horarios recibidos:', {
      estacion: data.nombreEstacion,
      parametros: data.parametros?.length,
    });

    return transformHourlyData(data);
  } catch (error) {
    console.error('❌ Error obteniendo datos horarios históricos:', error);
    throw error;
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
 * @param numHours Número de horas hacia atrás
 * @returns Map con datos por estación
 */
export async function getLastHoursData(numHours: number = 24): Promise<Map<number, HourlyStationData[]>> {
  // Calcular fecha y hora inicial (N horas hacia atrás)
  const now = new Date();
  const startDate = new Date(now.getTime() - numHours * 60 * 60 * 1000);

  // Formatear a DD/MM/YYYY HH:MM
  const day = String(startDate.getDate()).padStart(2, '0');
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const year = startDate.getFullYear();
  const hours = String(startDate.getHours()).padStart(2, '0');
  const minutes = String(startDate.getMinutes()).padStart(2, '0');

  const startDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

  console.log(`📅 Obteniendo últimas ${numHours} horas desde ${startDateTime}`);

  return await getViveiroHourlyHistoricalData(startDateTime, numHours);
}

/**
 * Transforma los datos de la API al formato de la aplicación
 */
function transformHourlyData(apiData: HourlyHistoricalResponse): HourlyStationData[] {
  if (!apiData.parametros || !Array.isArray(apiData.parametros)) {
    return [];
  }

  // Crear un mapa de timestamps
  const timestampMap = new Map<string, HourlyStationData>();

  // Procesar cada parámetro
  apiData.parametros.forEach((param) => {
    if (!param.valores || !Array.isArray(param.valores)) return;

    param.valores.forEach((valor) => {
      const timestamp = valor.fecha;

      // Obtener o crear punto de datos para este timestamp
      let dataPoint = timestampMap.get(timestamp);
      if (!dataPoint) {
        dataPoint = { timestamp };
        timestampMap.set(timestamp, dataPoint);
      }

      // Mapear parámetros a propiedades
      const value = typeof valor.valor === 'string' ? parseFloat(valor.valor) : valor.valor;

      switch (param.codigo) {
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
          // Convertir de m/s a km/h si es necesario
          dataPoint.windSpeed = param.unidade === 'm/s' ? msToKmh(value) : value;
          break;
        case 'DV_AVG_10m':
        case 'DV_AVG_2m':
          dataPoint.windDirection = value;
          break;
        case 'PA_AVG_1.5m':
        case 'PA_AVG_2m':
          dataPoint.pressure = value;
          break;
        case 'RS_AVG_1.5m':
        case 'RS_AVG_2m':
          dataPoint.solarRadiation = value;
          break;
        default:
          // Guardar otros parámetros con su código original
          dataPoint[param.codigo] = value;
      }
    });
  });

  // Convertir el mapa a array y ordenar por timestamp
  return Array.from(timestampMap.values()).sort((a, b) =>
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
