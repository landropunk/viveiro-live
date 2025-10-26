/**
 * Tipos para la API de MeteoGalicia
 */

export interface WeatherLocation {
  id: number;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface WeatherDataPoint {
  timestamp: string;
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  skyState: string;
  skyStateIcon?: string; // URL del icono de MeteoGalicia
  humidity?: number; // Humedad relativa en %
}

export interface WeatherForecast {
  location: WeatherLocation;
  data: WeatherDataPoint[];
  lastUpdate: string;
}

export interface MeteoGaliciaApiResponse {
  idConcello: number;
  nomeConcello: string;
  provincia: string;
  listaPredDiaConcello: Array<{
    dataPredicion: string;
    nivelAviso: number;
    tMax: number;
    tMin: number;
    uvMax: number;
    listaPredDia: Array<{
      estadoCeo: string;
      temperatura: number;
      vento: number;
      uvIndex?: number;
      pchuvia: number;
    }>;
  }>;
}

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  skyState: string;
  skyStateIcon?: string;
  humidity?: number; // Humedad relativa en %
  timestamp: string;
}

/**
 * Respuesta de la API RSS/JSON para predicción por municipio
 */
export interface MunicipalityForecastResponse {
  predConcello: {
    idConcello: number;
    nome: string;
    listaPredDiaConcello: Array<{
      dataPredicion: string;
      nivelAviso: number;
      tMax: number;
      tMin: number;
      uvMax: number;
      ceo: {
        manha: number;
        tarde: number;
        noite: number;
      };
      pchoiva: {
        manha: number;
        tarde: number;
        noite: number;
      };
      vento: {
        manha: number;
        tarde: number;
        noite: number;
      };
      tmaxFranxa: number | null;
      tminFranxa: number | null;
    }>;
  };
}

/**
 * Datos diarios agregados para la UI
 */
export interface DailyWeatherData {
  date: string;
  tempMax: number;
  tempMin: number;
  uvMax: number;
  warningLevel: number;
  morning: {
    skyState: number;
    rainProbability: number;
    windDirection: number;
  };
  afternoon: {
    skyState: number;
    rainProbability: number;
    windDirection: number;
  };
  night: {
    skyState: number;
    rainProbability: number;
    windDirection: number;
  };
}

/**
 * Información de estación meteorológica
 */
export interface WeatherStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

/**
 * Medición de una variable meteorológica
 */
export interface StationMeasurement {
  parameterCode: string;
  parameterName: string;
  unit: string;
  value: number;
  validationCode: number;
}

/**
 * Datos de observación de una estación (últimos 10 minutos)
 */
export interface StationObservation {
  stationId: number;
  stationName: string;
  timestamp: string;
  measurements: StationMeasurement[];
}

/**
 * Respuesta de la API de observaciones (últimos 10 minutos)
 */
export interface StationObservationsResponse {
  listUltimos10min: Array<{
    estacion: string;
    idEstacion: number;
    instanteLecturaUTC: string;
    listaMedidas: Array<{
      codigoParametro: string;
      lnCodigoValidacion: number;
      nomeParametro: string;
      unidade: string;
      valor: number;
    }>;
  }>;
}

/**
 * Datos procesados para gráficos comparativos (punto único)
 */
export interface StationComparisonData {
  parameter: string;
  parameterName: string;
  unit: string;
  stations: {
    [stationId: number]: {
      name: string;
      value: number;
      timestamp: string;
    };
  };
}

/**
 * Datos procesados para gráficos comparativos temporales (serie de tiempo)
 */
export interface StationComparisonTimeSeries {
  parameterCode: string;
  parameterName: string;
  unit: string;
  stations: {
    [stationId: number]: HistoricalTimeSeries;
  };
}

/**
 * Dato histórico de una variable en un momento específico
 */
export interface HistoricalDataPoint {
  timestamp: string;
  value: number;
  validationCode?: number;
}

/**
 * Serie temporal de datos históricos para una variable
 */
export interface HistoricalTimeSeries {
  parameterCode: string;
  parameterName: string;
  unit: string;
  data: HistoricalDataPoint[];
}

/**
 * Datos históricos completos de una estación
 */
export interface StationHistoricalData {
  stationId: number;
  stationName: string;
  period: HistoricalPeriod;
  startDate: string;
  endDate: string;
  variables: HistoricalTimeSeries[];
}

/**
 * Períodos disponibles para consulta histórica
 * NOTA: MeteoGalicia solo proporciona hasta 72 horas (3 días) de datos históricos
 */
export type HistoricalPeriod = '24h' | '48h' | '72h';

/**
 * Variables meteorológicas disponibles para visualización
 */
export type WeatherVariable =
  | 'TA_AVG_1.5m'      // Temperatura
  | 'HR_AVG_1.5m'      // Humedad
  | 'VV_AVG_10m'       // Velocidad viento (solo datos actuales)
  | 'VV_RACHA_10m'     // Racha viento a 10m (Penedo do Galo)
  | 'VV_RACHA_2m'      // Racha viento a 2m (Borreiros)
  | 'DV_AVG_10m'       // Dirección viento a 10m (Penedo do Galo)
  | 'DV_AVG_2m'        // Dirección viento a 2m (Borreiros)
  | 'PP_SUM_1.5m'      // Precipitación
  | 'PR_AVG_1.5m'      // Presión
  | 'RS_AVG_1.5m'      // Radiación solar
  | 'TO_AVG_1.5m';     // Temperatura rocío
