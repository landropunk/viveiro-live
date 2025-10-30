/**
 * Servicio para integración con MeteoGalicia API V5
 * Documentación: http://servizos.meteogalicia.es/api_manual/
 * API V5 proporciona mayor precisión con grid de 1km (vs 4km en V4)
 */

import type {
  WeatherForecast,
  WeatherDataPoint,
  CurrentWeatherData,
  MunicipalityForecastResponse,
  DailyWeatherData
} from '@/types/weather';
import { msToKmh, kmhToMs } from './utils';

const METEOGALICIA_API_BASE = 'https://servizos.meteogalicia.gal/apiv5';
const METEOGALICIA_RSS_BASE = 'https://servizos.meteogalicia.gal/rss/predicion';

// Coordenadas de Viveiro, Lugo
const VIVEIRO_LOCATION = {
  id: 27066,
  name: 'Viveiro',
  province: 'Lugo',
  latitude: 43.6626,
  longitude: -7.5947,
};

/**
 * Obtiene la predicción meteorológica para Viveiro
 */
export async function getViveiroWeatherForecast(): Promise<WeatherForecast> {
  try {
    const API_KEY = process.env.METEOGALICIA_API_KEY || '';

    if (!API_KEY) {
      console.warn('⚠️ METEOGALICIA_API_KEY no está configurada');
    }

    // Endpoint para predicción por coordenadas - incluir relative_humidity
    const url = new URL(`${METEOGALICIA_API_BASE}/getNumericForecastInfo`);
    url.searchParams.append('coords', `${VIVEIRO_LOCATION.longitude},${VIVEIRO_LOCATION.latitude}`);
    url.searchParams.append('variables', 'temperature,precipitation_amount,wind,sky_state,relative_humidity');
    url.searchParams.append('API_KEY', API_KEY);

    console.log('📡 Llamando a MeteoGalicia API V5:', url.toString().replace(API_KEY, 'XXXXX'));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Sin caché - datos frescos en cada request
    });

    console.log('📥 Respuesta API V5:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error API MeteoGalicia: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ Datos recibidos de API V5:', {
      features: data.features?.length,
      days: data.features?.[0]?.properties?.days?.length,
    });

    return transformMeteoGaliciaData(data);
  } catch (error) {
    console.error('❌ Error obteniendo datos de MeteoGalicia:', error);
    throw error;
  }
}

/**
 * Calcula la sensación térmica (Wind Chill o Heat Index)
 *
 * Para temperaturas < 10°C con viento: usa Wind Chill
 * Para temperaturas > 27°C con humedad alta: usa Heat Index
 * En otros casos: temperatura real
 *
 * @param temp Temperatura en °C
 * @param windSpeedKmh Velocidad del viento en km/h
 * @param humidity Humedad relativa en % (opcional)
 */
function calculateFeelsLike(temp: number, windSpeedKmh: number, humidity?: number): number {
  // Si la temperatura es menor a 10°C y hay viento, calcular Wind Chill
  if (temp <= 10 && windSpeedKmh > 4.8) { // 4.8 km/h ≈ 1.34 m/s

    // Fórmula de Wind Chill (Environment Canada / NOAA)
    // WC = 13.12 + 0.6215*T - 11.37*(V^0.16) + 0.3965*T*(V^0.16)
    const windChill = 13.12 +
                      0.6215 * temp -
                      11.37 * Math.pow(windSpeedKmh, 0.16) +
                      0.3965 * temp * Math.pow(windSpeedKmh, 0.16);

    return Math.round(windChill * 10) / 10;
  }

  // Si la temperatura es mayor a 27°C y tenemos humedad, calcular Heat Index
  if (temp >= 27 && humidity !== undefined && humidity >= 40) {
    // Fórmula simplificada de Heat Index (Steadman)
    const T = temp;
    const RH = humidity;

    // Heat Index simplificado
    const HI = -8.78469475556 +
               1.61139411 * T +
               2.33854883889 * RH +
               -0.14611605 * T * RH +
               -0.012308094 * T * T +
               -0.0164248277778 * RH * RH +
               0.002211732 * T * T * RH +
               0.00072546 * T * RH * RH +
               -0.000003582 * T * T * RH * RH;

    return Math.round(HI * 10) / 10;
  }

  // En condiciones normales, la sensación térmica es similar a la temperatura real
  // pero con un pequeño ajuste por viento suave
  if (windSpeedKmh > 3.6) { // 3.6 km/h ≈ 1 m/s
    // Ajuste muy suave: por cada 36 km/h de viento, restar ~0.5°C
    const windAdjustment = (windSpeedKmh / 36) * 0.5;
    return Math.round((temp - windAdjustment) * 10) / 10;
  }

  return temp;
}

/**
 * Obtiene datos meteorológicos actuales
 */
export async function getCurrentWeather(): Promise<CurrentWeatherData> {
  try {
    const forecast = await getViveiroWeatherForecast();
    const currentData = forecast.data[0];

    if (!currentData) {
      throw new Error('No hay datos disponibles');
    }

    const feelsLike = calculateFeelsLike(
      currentData.temperature,
      currentData.windSpeed,
      currentData.humidity
    );

    return {
      temperature: currentData.temperature,
      feelsLike,
      windSpeed: currentData.windSpeed,
      windDirection: currentData.windDirection,
      precipitation: currentData.precipitation,
      skyState: currentData.skyState,
      skyStateIcon: currentData.skyStateIcon,
      humidity: currentData.humidity,
      timestamp: currentData.timestamp,
    };
  } catch (error) {
    console.error('Error obteniendo clima actual:', error);
    throw error;
  }
}

/**
 * Transforma los datos de la API de MeteoGalicia al formato de la aplicación
 */
function transformMeteoGaliciaData(apiData: any): WeatherForecast {
  const weatherData: WeatherDataPoint[] = [];

  try {
    // La API de MeteoGalicia devuelve datos en formato GeoJSON
    if (apiData.features && Array.isArray(apiData.features)) {
      apiData.features.forEach((feature: any) => {
        if (feature.properties && feature.properties.days) {
          feature.properties.days.forEach((day: any) => {
            // Verificar que day.variables existe y es un array
            if (day.variables && Array.isArray(day.variables)) {
              // Crear un mapa de timestamps para combinar variables
              const timestampMap = new Map<string, WeatherDataPoint>();

              day.variables.forEach((variable: any) => {
                if (!variable.values || !Array.isArray(variable.values)) return;

                variable.values.forEach((valueObj: any) => {
                  if (!valueObj.timeInstant) return;

                  try {
                    // Usar el timestamp directamente de la API
                    const timestamp = valueObj.timeInstant;

                    // Obtener o crear punto de datos para este timestamp
                    let dataPoint = timestampMap.get(timestamp);
                    if (!dataPoint) {
                      dataPoint = {
                        timestamp,
                        temperature: 0,
                        precipitation: 0,
                        windSpeed: 0,
                        windDirection: 0,
                        skyState: 'Desconocido',
                        skyStateIcon: undefined,
                      };
                      timestampMap.set(timestamp, dataPoint);
                    }

                    // Mapear variables según el nombre
                    if (variable.name) {
                      switch (variable.name.toLowerCase()) {
                        case 'temperature':
                          dataPoint.temperature = parseFloat(valueObj.value) || 0;
                          break;
                        case 'precipitation_amount':
                        case 'precipitation':
                          dataPoint.precipitation = parseFloat(valueObj.value) || 0;
                          break;
                        case 'wind':
                          // Wind tiene moduleValue y directionValue
                          // La API devuelve en m/s, convertimos a km/h
                          if (valueObj.moduleValue !== undefined) {
                            const windMs = parseFloat(valueObj.moduleValue) || 0;
                            dataPoint.windSpeed = msToKmh(windMs);
                          }
                          if (valueObj.directionValue !== undefined) {
                            dataPoint.windDirection = parseFloat(valueObj.directionValue) || 0;
                          }
                          break;
                        case 'sky_state':
                          dataPoint.skyState = getSkyStateName(String(valueObj.value));
                          // Guardar también el icono de la API
                          if (valueObj.iconURL) {
                            dataPoint.skyStateIcon = valueObj.iconURL;
                          }
                          break;
                        case 'relative_humidity':
                          dataPoint.humidity = parseFloat(valueObj.value) || undefined;
                          break;
                      }
                    }
                  } catch (err) {
                    // Si hay error parseando una fecha, la ignoramos
                    console.warn('Error parseando timestamp:', valueObj.timeInstant, err);
                  }
                });
              });

              // Agregar todos los puntos del mapa al array
              weatherData.push(...Array.from(timestampMap.values()));
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error transformando datos de MeteoGalicia:', error);
  }

  // Si no hay datos válidos de la API, lanzar error
  if (weatherData.length === 0) {
    console.error('❌ No se obtuvieron datos válidos de la API de MeteoGalicia');
    throw new Error('No se pudieron obtener datos meteorológicos del servicio de MeteoGalicia. Por favor, inténtelo de nuevo más tarde.');
  }

  console.log('✅ Datos transformados correctamente:', {
    totalPoints: weatherData.length,
    firstTimestamp: weatherData[0]?.timestamp,
    lastTimestamp: weatherData[weatherData.length - 1]?.timestamp,
  });

  return {
    location: VIVEIRO_LOCATION,
    data: weatherData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Obtiene el nombre del estado del cielo en español
 * Actualizado 2024: Catálogo ampliado con 8 nuevas opciones
 */
export function getSkyStateName(code: string): string {
  const skyStates: Record<string, string> = {
    // API V5 strings (mismo formato que V4)
    'SUNNY': 'Despejado',
    'PARTLY_CLOUDY': 'Parcialmente nublado',
    'HIGH_CLOUDS': 'Nubes altas',
    'CLOUDY': 'Nublado',
    'OVERCAST': 'Cubierto',
    'DRIZZLE': 'Llovizna',
    'WEAK_RAIN': 'Lluvia débil',
    'RAIN': 'Lluvia',
    'SHOWERS': 'Chubascos',
    'WEAK_SHOWERS': 'Chubascos débiles',
    'OVERCAST_AND_SHOWERS': 'Cubierto con chubascos',
    'STORM': 'Tormenta',
    'SNOW': 'Nieve',
    'FOG': 'Niebla',
    'MIST': 'Neblina',

    // Nuevos iconos 2024 (basado en actualización MeteoGalicia)
    'WEAK_SNOW': 'Nieve débil',
    'SNOW_SHOWERS': 'Chubascos de nieve',
    'SLEET': 'Aguanieve',
    'HAIL': 'Granizo',
    'THUNDERSTORM': 'Tormenta eléctrica',
    'FREEZING_RAIN': 'Lluvia engelante',
    'SANDSTORM': 'Tormenta de arena',
    'DUST': 'Polvo en suspensión',

    // Códigos numéricos (legacy)
    '1': 'Despejado',
    '2': 'Poco nublado',
    '3': 'Parcialmente nublado',
    '4': 'Nublado',
    '5': 'Muy nublado',
    '6': 'Cubierto',
    '7': 'Niebla',
    '8': 'Chubascos',
    '9': 'Lluvia',
    '10': 'Tormenta',
    '11': 'Nieve',
    '12': 'Aguanieve',
    '13': 'Granizo',
    '14': 'Tormenta eléctrica',
    '15': 'Lluvia engelante',
  };

  return skyStates[code] || code;
}

/**
 * Obtiene la dirección del viento en español (versión corta)
 * @param degrees Dirección en grados (0-360)
 * @returns Abreviatura del punto cardinal (N, NE, E, SE, S, SO, O, NO)
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Obtiene la dirección del viento en español (versión completa)
 * @param degrees Dirección en grados (0-360)
 * @returns Nombre completo del punto cardinal
 */
export function getWindDirectionFull(degrees: number): string {
  const directions = [
    'Norte',
    'Noreste',
    'Este',
    'Sureste',
    'Sur',
    'Suroeste',
    'Oeste',
    'Noroeste'
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Obtiene la dirección del viento con formato completo (nombre + grados)
 * @param degrees Dirección en grados (0-360)
 * @returns Formato: "Norte (0°)" o "Suroeste (225°)"
 */
export function getWindDirectionWithDegrees(degrees: number): string {
  const directionName = getWindDirectionFull(degrees);
  return `${directionName} (${Math.round(degrees)}°)`;
}

/**
 * Obtiene la predicción diaria por municipio con datos de UV
 * Este endpoint proporciona datos que NO están disponibles en getNumericForecastInfo:
 * - uvMax: Índice UV máximo del día
 * - tMax/tMin: Temperaturas máximas y mínimas
 * - nivelAviso: Nivel de aviso meteorológico
 */
export async function getMunicipalityForecast(): Promise<DailyWeatherData[]> {
  try {
    const url = `${METEOGALICIA_RSS_BASE}/jsonPredConcellos.action?idConc=${VIVEIRO_LOCATION.id}`;

    console.log('📡 Llamando a MeteoGalicia RSS/JSON:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Sin caché - datos frescos en cada request
    });

    if (!response.ok) {
      throw new Error(`Error API RSS: ${response.status}`);
    }

    const data: MunicipalityForecastResponse = await response.json();

    console.log('✅ Datos municipales recibidos:', {
      municipio: data.predConcello.nome,
      dias: data.predConcello.listaPredDiaConcello.length,
    });

    // Transformar a formato de la aplicación
    return data.predConcello.listaPredDiaConcello.map(day => ({
      date: day.dataPredicion,
      tempMax: day.tMax,
      tempMin: day.tMin,
      uvMax: day.uvMax,
      warningLevel: day.nivelAviso,
      morning: {
        skyState: day.ceo.manha,
        rainProbability: day.pchoiva.manha,
        windDirection: day.vento.manha,
      },
      afternoon: {
        skyState: day.ceo.tarde,
        rainProbability: day.pchoiva.tarde,
        windDirection: day.vento.tarde,
      },
      night: {
        skyState: day.ceo.noite,
        rainProbability: day.pchoiva.noite,
        windDirection: day.vento.noite,
      },
    }));
  } catch (error) {
    console.error('❌ Error obteniendo datos municipales:', error);
    throw error;
  }
}
