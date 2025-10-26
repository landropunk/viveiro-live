'use client';

import { StationObservation, WeatherStation } from '@/types/weather';
import { formatObservationTime, getMeasurementValueConverted, getMeasurementUnit } from '@/lib/meteogalicia-stations';
import { getWindDirectionFull } from '@/lib/meteogalicia';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

interface StationDetailCardProps {
  station: WeatherStation;
  observation: StationObservation | null;
}

interface ParameterDisplay {
  code: string;
  label: string;
  icon: string;
  decimals: number;
  fallback?: string;
  category: 'main' | 'wind' | 'additional';
}

const PARAMETERS_DISPLAY: ParameterDisplay[] = [
  // Parámetros principales
  { code: 'TA_AVG_1.5m', label: 'Temperatura', icon: '🌡️', decimals: 1, category: 'main' },
  { code: 'HR_AVG_1.5m', label: 'Humedad Relativa', icon: '💧', decimals: 0, category: 'main' },
  { code: 'PP_SUM_1.5m', label: 'Precipitación', icon: '🌧️', decimals: 1, category: 'main' },
  { code: 'PR_AVG_1.5m', label: 'Presión Atmosférica', icon: '📊', decimals: 1, category: 'main' },

  // Viento
  { code: 'VV_AVG_10m', label: 'Velocidad del Viento', icon: '💨', decimals: 1, fallback: 'VV_AVG_2m', category: 'wind' },
  { code: 'VV_RACHA_10m', label: 'Racha Máxima', icon: '🌪️', decimals: 1, fallback: 'VV_RACHA_2m', category: 'wind' },
  { code: 'DV_AVG_10m', label: 'Dirección del Viento', icon: '🧭', decimals: 0, fallback: 'DV_AVG_2m', category: 'wind' },

  // Adicionales
  { code: 'TO_AVG_1.5m', label: 'Temperatura de Rocío', icon: '🌡️', decimals: 1, category: 'additional' },
  { code: 'RS_AVG_1.5m', label: 'Radiación Solar', icon: '☀️', decimals: 0, category: 'additional' },
  { code: 'BIO_AVG_1.5m', label: 'Radiación UV', icon: '🔆', decimals: 1, category: 'additional' },
];

export default function StationDetailCard({ station, observation }: StationDetailCardProps) {
  if (!observation) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {station.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  const getValue = (paramCode: string, fallback?: string) => {
    let value = getMeasurementValueConverted(observation, paramCode);
    if (value === null && fallback) {
      value = getMeasurementValueConverted(observation, fallback);
    }
    return value;
  };

  const getUnit = (paramCode: string, fallback?: string) => {
    let unit = getMeasurementUnit(observation, paramCode);
    if (!unit && fallback) {
      unit = getMeasurementUnit(observation, fallback);
    }
    return unit;
  };

  // Calcular sensación térmica
  const temperature = getValue('TA_AVG_1.5m');
  const windSpeed = getValue('VV_AVG_10m', 'VV_AVG_2m');
  const feelsLike = temperature !== null && windSpeed !== null
    ? calculateFeelsLike(temperature, windSpeed)
    : null;

  // Obtener dirección del viento
  const windDirection = getValue('DV_AVG_10m', 'DV_AVG_2m');
  const windDirectionText = windDirection !== null ? getWindDirectionFull(windDirection) : null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{station.name}</h2>
            <p className="text-blue-100 text-sm">
              Altitud: {station.altitude}m | Lat: {station.latitude.toFixed(4)}° | Lon: {station.longitude.toFixed(4)}°
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100 mb-1">Última actualización</p>
            <p className="text-sm font-medium">
              {formatObservationTime(observation.timestamp)}
            </p>
          </div>
        </div>
      </div>

      {/* Temperatura principal */}
      {temperature !== null && (
        <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Temperatura Actual</p>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">
              {temperature.toFixed(1)}<span className="text-3xl text-gray-500 dark:text-gray-400">°C</span>
            </p>
            {feelsLike !== null && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sensación térmica: <span className="font-semibold">{feelsLike.toFixed(1)}°C</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Parámetros principales */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Condiciones Actuales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PARAMETERS_DISPLAY.filter(p => p.category === 'main').map((param) => {
            const value = getValue(param.code, param.fallback);
            const unit = getUnit(param.code, param.fallback);

            if (value === null) return null;

            return (
              <div
                key={param.code}
                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{param.icon}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {param.label}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {value.toFixed(param.decimals)}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    {unit}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Información del viento */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">Viento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PARAMETERS_DISPLAY.filter(p => p.category === 'wind').map((param) => {
            const value = getValue(param.code, param.fallback);
            const unit = getUnit(param.code, param.fallback);

            if (value === null) return null;

            return (
              <div
                key={param.code}
                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{param.icon}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {param.label}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {value.toFixed(param.decimals)}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                      {unit}
                    </span>
                  </p>
                  {param.code.includes('DV_AVG') && windDirectionText && (
                    <div className="flex items-center gap-1">
                      <ArrowUpIcon
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        style={{ transform: `rotate(${value}deg)` }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {windDirectionText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Parámetros adicionales */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">Información Adicional</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PARAMETERS_DISPLAY.filter(p => p.category === 'additional').map((param) => {
            const value = getValue(param.code, param.fallback);
            const unit = getUnit(param.code, param.fallback);

            if (value === null) return null;

            return (
              <div
                key={param.code}
                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{param.icon}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {param.label}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {value.toFixed(param.decimals)}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    {unit}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Calcula la sensación térmica simple
 * @param temp Temperatura en °C
 * @param windSpeedKmh Velocidad del viento en km/h
 */
function calculateFeelsLike(temp: number, windSpeedKmh: number): number {
  // Para vientos bajos, la sensación es similar a la temperatura real
  if (windSpeedKmh < 7.2) return temp; // ~2 m/s = 7.2 km/h

  // Wind chill simplificado para temperaturas bajas
  if (temp <= 10) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeedKmh, 0.16) + 0.3965 * temp * Math.pow(windSpeedKmh, 0.16);
  }

  // Para temperaturas normales, ligera reducción por viento
  return temp - (windSpeedKmh / 36); // Ajustado para km/h
}
