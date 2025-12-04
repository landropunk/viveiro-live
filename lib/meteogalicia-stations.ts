/**
 * Servicio para integración con estaciones meteorológicas de MeteoGalicia
 * API V5 - Endpoints de observación
 */

import type {
  WeatherStation,
  StationObservation,
  StationObservationsResponse,
  StationMeasurement,
  StationComparisonData,
} from '@/types/weather';
import { msToKmh } from './utils';

const METEOGALICIA_OBS_BASE = 'https://servizos.meteogalicia.gal/mgrss/observacion';

/**
 * Estaciones meteorológicas de Viveiro
 */
export const VIVEIRO_STATIONS: WeatherStation[] = [
  {
    id: 10104,
    name: 'Penedo do Galo',
    latitude: 43.660763,
    longitude: -7.562965,
    altitude: 545, // metros
  },
  {
    id: 10162,
    name: 'Borreiros',
    latitude: 43.630886,
    longitude: -7.630877,
    altitude: 59, // metros
  },
];

/**
 * Mapeo de códigos de parámetros a nombres amigables en español
 */
export const PARAMETER_NAMES: Record<string, string> = {
  'TA_AVG_1.5m': 'Temperatura',
  'TA_AVG_0.1m': 'Temperatura (0.1m)',
  'TO_AVG_1.5m': 'Temperatura de rocío',
  'TS_AVG_-0.1m': 'Temperatura del suelo',
  'HR_AVG_1.5m': 'Humedad relativa',
  'PP_SUM_1.5m': 'Precipitación',
  'VV_AVG_10m': 'Velocidad del viento',
  'VV_AVG_2m': 'Velocidad del viento',
  'VV_RACHA_10m': 'Racha de viento',
  'VV_RACHA_2m': 'Racha de viento',
  'DV_AVG_10m': 'Dirección del viento',
  'DV_AVG_2m': 'Dirección del viento',
  'PR_AVG_1.5m': 'Presión atmosférica',
  'PRED_AVG_1.5m': 'Presión reducida',
  'RS_AVG_1.5m': 'Radiación solar',
  'HSOL_SUM_1.5m': 'Horas de sol',
  'BIO_AVG_1.5m': 'Radiación UV',
  'BCN_AVG_1.5m': 'Brillo del cielo nocturno',
  'VV_SD_10m': 'Desv. típica viento',
  'VV_SD_2m': 'Desv. típica viento',
  'DV_SD_10m': 'Desv. típica dirección',
  'DV_SD_2m': 'Desv. típica dirección',
  'DV_CONDICION_10m': 'Dirección racha',
  'DV_CONDICION_2m': 'Dirección racha',
  'HF_SUM_2m': 'Humedad foliar',
};

/**
 * Mapeo de códigos de parámetros a unidades de medida
 */
export const UNITS: Record<string, string> = {
  'TA_AVG_1.5m': '°C',
  'TA_AVG_2m': '°C',
  'TA_AVG_0.1m': '°C',
  'TO_AVG_1.5m': '°C',
  'TS_AVG_-0.1m': '°C',
  'HR_AVG_1.5m': '%',
  'HR_AVG_2m': '%',
  'PP_SUM_1.5m': 'mm',
  'PP_SUM_2m': 'mm',
  'VV_AVG_10m': 'km/h',
  'VV_AVG_2m': 'km/h',
  'VV_RACHA_10m': 'km/h',
  'VV_RACHA_2m': 'km/h',
  'DV_AVG_10m': '°',
  'DV_AVG_2m': '°',
  'PR_AVG_1.5m': 'hPa',
  'PA_AVG_1.5m': 'hPa',
  'PA_AVG_2m': 'hPa',
  'PRED_AVG_1.5m': 'hPa',
  'RS_AVG_1.5m': 'W/m²',
  'RS_AVG_2m': 'W/m²',
  'HSOL_SUM_1.5m': 'h',
  'BIO_AVG_1.5m': 'W/m²',
  'BCN_AVG_1.5m': 'mag/arcsec²',
  'VV_SD_10m': 'km/h',
  'VV_SD_2m': 'km/h',
  'DV_SD_10m': '°',
  'DV_SD_2m': '°',
  'DV_CONDICION_10m': '°',
  'DV_CONDICION_2m': '°',
  'HF_SUM_2m': 'min',
};

/**
 * Parámetros principales para mostrar en gráficos
 */
export const MAIN_PARAMETERS = [
  'TA_AVG_1.5m',
  'HR_AVG_1.5m',
  'VV_AVG_10m',
  'VV_AVG_2m',
  'PP_SUM_1.5m',
  'PR_AVG_1.5m',
  'DV_AVG_10m',
  'DV_AVG_2m',
];

/**
 * Obtiene los datos actuales de todas las estaciones de Viveiro
 */
export async function getViveiroStationsData(): Promise<StationObservation[]> {
  try {
    // Obtener datos de cada estación individualmente
    const stationPromises = VIVEIRO_STATIONS.map(station => {
      const url = `${METEOGALICIA_OBS_BASE}/ultimos10minEstacionsMeteo.action?idEst=${station.id}`;
      console.log(`📡 Llamando API observaciones para estación ${station.name}:`, url);

      return fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
    });

    const responses = await Promise.all(stationPromises);

    // Verificar respuestas
    const failedResponse = responses.find(r => !r.ok);
    if (failedResponse) {
      throw new Error(`Error API observaciones: ${failedResponse.status}`);
    }

    const dataArrays = await Promise.all(responses.map(r => r.json()));

    // Transformar datos al formato de la aplicación
    const observations: StationObservation[] = [];

    for (let i = 0; i < dataArrays.length; i++) {
      const stationData = dataArrays[i];
      const station = VIVEIRO_STATIONS[i];

      if (stationData && stationData.listUltimos10min && stationData.listUltimos10min.length > 0) {
        const latestReading = stationData.listUltimos10min[0];

        observations.push({
          stationId: station.id,
          stationName: station.name,
          timestamp: latestReading.instanteLecturaUTC,
          measurements: latestReading.listaMedidas.map((medida: any) => ({
            parameterCode: medida.codigoParametro,
            parameterName: PARAMETER_NAMES[medida.codigoParametro] || medida.nomeParametro,
            unit: medida.unidade,
            value: medida.valor,
            validationCode: medida.lnCodigoValidacion,
          })),
        });
      }
    }

    console.log('✅ Datos de estaciones recibidos:', {
      total: observations.length,
      stations: observations.map(s => `${s.stationName} (${s.stationId})`),
    });

    return observations;
  } catch (error) {
    console.error('❌ Error obteniendo datos de estaciones:', error);
    throw error;
  }
}

/**
 * Obtiene los datos de una estación específica
 */
export async function getStationData(stationId: number): Promise<StationObservation | null> {
  const allStations = await getViveiroStationsData();
  return allStations.find(station => station.stationId === stationId) || null;
}

/**
 * Prepara datos para comparación entre estaciones
 */
export function prepareComparisonData(
  observations: StationObservation[]
): StationComparisonData[] {
  // Obtener todos los parámetros únicos
  const parametersSet = new Set<string>();
  observations.forEach(obs => {
    obs.measurements.forEach(m => {
      if (MAIN_PARAMETERS.includes(m.parameterCode)) {
        parametersSet.add(m.parameterCode);
      }
    });
  });

  const comparisonData: StationComparisonData[] = [];

  parametersSet.forEach(parameterCode => {
    const stationsData: Record<number, any> = {};

    observations.forEach(obs => {
      const measurement = obs.measurements.find(m => m.parameterCode === parameterCode);
      if (measurement) {
        stationsData[obs.stationId] = {
          name: obs.stationName,
          value: measurement.value,
          timestamp: obs.timestamp,
        };
      }
    });

    const firstMeasurement = observations[0]?.measurements.find(
      m => m.parameterCode === parameterCode
    );

    if (firstMeasurement && Object.keys(stationsData).length > 0) {
      comparisonData.push({
        parameter: parameterCode,
        parameterName: firstMeasurement.parameterName,
        unit: firstMeasurement.unit,
        stations: stationsData,
      });
    }
  });

  return comparisonData;
}

/**
 * Obtiene un valor específico de una medición
 * NOTA: Los valores de viento se devuelven en las unidades originales de la API (m/s)
 * Usar getMeasurementValueConverted() para obtener viento en km/h
 */
export function getMeasurementValue(
  observation: StationObservation | null,
  parameterCode: string
): number | null {
  if (!observation || !observation.measurements) {
    return null;
  }
  const measurement = observation.measurements.find(m => m.parameterCode === parameterCode);
  return measurement ? measurement.value : null;
}

/**
 * Obtiene un valor específico de una medición con conversión automática
 * - Velocidades de viento (VV_*) se convierten de m/s a km/h
 * - Otros valores se devuelven sin modificar
 */
export function getMeasurementValueConverted(
  observation: StationObservation | null,
  parameterCode: string
): number | null {
  const value = getMeasurementValue(observation, parameterCode);
  if (value === null) return null;

  // Convertir velocidades de viento de m/s a km/h
  if (parameterCode.startsWith('VV_')) {
    return msToKmh(value);
  }

  return value;
}

/**
 * Obtiene la unidad de medida con conversión automática
 * - Velocidades de viento se reportan como km/h
 * - Otras unidades se devuelven sin modificar
 */
export function getMeasurementUnit(
  observation: StationObservation | null,
  parameterCode: string
): string {
  if (!observation || !observation.measurements) {
    return '';
  }

  const measurement = observation.measurements.find(m => m.parameterCode === parameterCode);
  if (!measurement) return '';

  // Convertir unidad de viento de m/s a km/h
  if (parameterCode.startsWith('VV_') && measurement.unit === 'm/s') {
    return 'km/h';
  }

  return measurement.unit;
}

/**
 * Obtiene información de una estación por su ID
 */
export function getStationInfo(stationId: number): WeatherStation | undefined {
  return VIVEIRO_STATIONS.find(s => s.id === stationId);
}

/**
 * Formatea una fecha UTC a hora local
 */
export function formatObservationTime(utcTimestamp: string): string {
  const date = new Date(utcTimestamp);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  });
}
