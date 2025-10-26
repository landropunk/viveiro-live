/**
 * Servicio para datos históricos REALES de estaciones meteorológicas de MeteoGalicia
 *
 * Utiliza el endpoint oficial de MeteoGalicia para obtener datos horarios reales:
 * https://servizos.meteogalicia.gal/mgrss/observacion/ultimosHorariosEstacions.action
 */

import type {
  StationHistoricalData,
  HistoricalTimeSeries,
  HistoricalDataPoint,
  HistoricalPeriod,
  WeatherVariable,
} from '@/types/weather';
import { msToKmh } from './utils';

const METEOGALICIA_API_BASE = 'https://servizos.meteogalicia.gal/mgrss/observacion';

/**
 * Variables meteorológicas disponibles para visualización histórica
 * NOTA: Solo incluye variables que EXISTEN en el endpoint de históricos de MeteoGalicia
 * Endpoint: ultimosHorariosEstacions.action
 *
 * IMPORTANTE: Las estaciones tienen anemómetros a diferentes alturas:
 * - Penedo do Galo (10104): 10m de altura → VV_RACHA_10m, DV_AVG_10m
 * - Borreiros (10162): 2m de altura → VV_RACHA_2m, DV_AVG_2m
 *
 * NOTA: VV_AVG_10m NO existe en datos históricos (solo en observaciones actuales)
 */
export const HISTORICAL_VARIABLES: Partial<Record<WeatherVariable, { name: string; unit: string; color: string }>> = {
  'TA_AVG_1.5m': { name: 'Temperatura', unit: '°C', color: '#ef4444' },
  'HR_AVG_1.5m': { name: 'Humedad', unit: '%', color: '#3b82f6' },
  // VV_AVG_10m NO existe en datos históricos - ELIMINADA
  'VV_RACHA_10m': { name: 'Rachas de viento (10m)', unit: 'km/h', color: '#f59e0b' },
  'VV_RACHA_2m': { name: 'Rachas de viento (2m)', unit: 'km/h', color: '#fb923c' },
  'DV_AVG_10m': { name: 'Dirección del viento (10m)', unit: '°', color: '#8b5cf6' },
  'DV_AVG_2m': { name: 'Dirección del viento (2m)', unit: '°', color: '#a78bfa' },
  'PP_SUM_1.5m': { name: 'Precipitación', unit: 'mm', color: '#06b6d4' },
  // PR_AVG_1.5m, RS_AVG_1.5m, TO_AVG_1.5m - Verificar si existen en API
  'PR_AVG_1.5m': { name: 'Presión atmosférica', unit: 'hPa', color: '#ec4899' },
  'RS_AVG_1.5m': { name: 'Radiación solar', unit: 'W/m²', color: '#f97316' },
  'TO_AVG_1.5m': { name: 'Temperatura de rocío', unit: '°C', color: '#14b8a6' },
};

/**
 * Interfaz de respuesta de la API de MeteoGalicia
 */
interface MeteoGaliciaHourlyResponse {
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
 * Mapeo de códigos de parámetros entre lo que tenemos y lo que devuelve la API
 * Solo incluye variables confirmadas como existentes en ultimosHorariosEstacions.action
 *
 * Nota: Diferentes estaciones usan diferentes alturas de medición del viento
 */
const PARAMETER_CODE_MAP: Record<string, WeatherVariable> = {
  'TA_AVG_1.5m': 'TA_AVG_1.5m',
  'HR_AVG_1.5m': 'HR_AVG_1.5m',
  'VV_RACHA_10m': 'VV_RACHA_10m',  // Penedo do Galo
  'VV_RACHA_2m': 'VV_RACHA_2m',    // Borreiros
  'DV_AVG_10m': 'DV_AVG_10m',      // Penedo do Galo
  'DV_AVG_2m': 'DV_AVG_2m',        // Borreiros
  'PP_SUM_1.5m': 'PP_SUM_1.5m',
  'PR_AVG_1.5m': 'PR_AVG_1.5m',
  // VV_AVG_10m NO existe en la API de históricos - ELIMINADA
};

/**
 * Obtiene datos históricos REALES de una estación para un período específico
 *
 * @param stationId ID de la estación
 * @param period Período de tiempo ('24h', '7d', '30d')
 * @returns Datos históricos reales de la estación
 */
export async function getStationHistoricalData(
  stationId: number,
  period: HistoricalPeriod = '24h'
): Promise<StationHistoricalData> {
  try {
    // Calcular número de horas según el período
    const numHoras = getHoursForPeriod(period);

    console.log(`📊 Obteniendo datos históricos REALES: Estación ${stationId}, Período: ${period} (${numHoras}h)`);

    // Llamar al endpoint de MeteoGalicia
    const url = `${METEOGALICIA_API_BASE}/ultimosHorariosEstacions.action?idEst=${stationId}&numHoras=${numHoras}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MeteoGaliciaHourlyResponse = await response.json();

    if (!data.listHorarios || data.listHorarios.length === 0) {
      throw new Error('No se obtuvieron datos de la estación');
    }

    const stationData = data.listHorarios[0];
    const historicalData = transformToHistoricalData(stationData, period);

    console.log(`✅ Datos históricos REALES obtenidos: ${historicalData.variables.length} variables, ${stationData.listaInstantes.length} lecturas`);

    return historicalData;
  } catch (error) {
    console.error('❌ Error obteniendo datos históricos reales:', error);
    throw error;
  }
}

/**
 * Convierte número de horas según el período solicitado
 * NOTA: MeteoGalicia tiene un límite de ~72 horas de datos históricos
 */
function getHoursForPeriod(period: HistoricalPeriod): number {
  switch (period) {
    case '24h':
      return 24;
    case '48h':
      return 48;
    case '72h':
      return 72;
    default:
      return 24;
  }
}

/**
 * Transforma los datos de la API de MeteoGalicia al formato de nuestra aplicación
 */
function transformToHistoricalData(
  stationData: MeteoGaliciaHourlyResponse['listHorarios'][0],
  period: HistoricalPeriod
): StationHistoricalData {
  const { estacion, idEstacion, listaInstantes } = stationData;

  // Agrupar medidas por código de parámetro
  const parameterMap = new Map<string, HistoricalDataPoint[]>();

  // Procesar cada instante de lectura
  listaInstantes.forEach((instante) => {
    const timestamp = instante.instanteLecturaUTC;

    instante.listaMedidas.forEach((medida) => {
      const paramCode = medida.codigoParametro;

      // Solo procesar parámetros que conocemos
      if (!PARAMETER_CODE_MAP[paramCode]) {
        return;
      }

      if (!parameterMap.has(paramCode)) {
        parameterMap.set(paramCode, []);
      }

      // Convertir viento de m/s a km/h si es necesario
      let value = medida.valor;
      if (paramCode === 'VV_RACHA_10m' || paramCode === 'VV_AVG_10m') {
        value = msToKmh(value);
      }

      parameterMap.get(paramCode)!.push({
        timestamp,
        value: Number(value.toFixed(2)),
        validationCode: medida.lnCodigoValidacion,
      });
    });
  });

  // Convertir el mapa a array de series temporales
  const variables: HistoricalTimeSeries[] = [];

  parameterMap.forEach((dataPoints, paramCode) => {
    const mappedCode = PARAMETER_CODE_MAP[paramCode];
    const variableInfo = HISTORICAL_VARIABLES[mappedCode];

    if (variableInfo) {
      // Ordenar por timestamp descendente (más reciente primero)
      dataPoints.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      variables.push({
        parameterCode: mappedCode,
        parameterName: variableInfo.name,
        unit: variableInfo.unit,
        data: dataPoints,
      });
    }
  });

  // Calcular fechas de inicio y fin
  const timestamps = listaInstantes.map(i => new Date(i.instanteLecturaUTC).getTime());
  const startDate = new Date(Math.min(...timestamps)).toISOString();
  const endDate = new Date(Math.max(...timestamps)).toISOString();

  return {
    stationId: idEstacion,
    stationName: estacion.trim(),
    period,
    startDate,
    endDate,
    variables,
  };
}

/**
 * Obtiene datos históricos REALES para múltiples variables
 */
export async function getHistoricalDataForVariables(
  stationId: number,
  variables: WeatherVariable[],
  period: HistoricalPeriod = '24h'
): Promise<HistoricalTimeSeries[]> {
  const historicalData = await getStationHistoricalData(stationId, period);

  return historicalData.variables.filter(v =>
    variables.includes(v.parameterCode as WeatherVariable)
  );
}

/**
 * Obtiene datos históricos REALES para comparación entre múltiples estaciones
 */
export async function getComparisonData(
  stationIds: number[],
  period: HistoricalPeriod = '24h'
): Promise<Map<number, StationHistoricalData>> {
  const comparisonMap = new Map<number, StationHistoricalData>();

  // Obtener datos de todas las estaciones en paralelo
  const promises = stationIds.map(async (stationId) => {
    try {
      const data = await getStationHistoricalData(stationId, period);
      return { stationId, data };
    } catch (error) {
      console.error(`Error obteniendo datos de estación ${stationId}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);

  results.forEach((result) => {
    if (result) {
      comparisonMap.set(result.stationId, result.data);
    }
  });

  return comparisonMap;
}

/**
 * Obtiene estadísticas agregadas de una variable en un período
 */
export function getVariableStats(timeSeries: HistoricalTimeSeries): {
  min: number;
  max: number;
  avg: number;
  latest: number;
} {
  const values = timeSeries.data.map(d => d.value);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, v) => sum + v, 0) / values.length,
    latest: values[values.length - 1] || 0,
  };
}

/**
 * Formatea el nombre del período para visualización
 */
export function formatPeriodName(period: HistoricalPeriod): string {
  const names: Record<HistoricalPeriod, string> = {
    '24h': 'Últimas 24 horas',
    '48h': 'Últimos 2 días',
    '72h': 'Últimos 3 días',
  };
  return names[period];
}
