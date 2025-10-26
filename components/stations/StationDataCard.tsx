'use client';

import { useRouter } from 'next/navigation';
import { StationObservation, WeatherStation } from '@/types/weather';
import { formatObservationTime, getMeasurementValueConverted, getMeasurementUnit } from '@/lib/meteogalicia-stations';
import { getWindDirectionFull } from '@/lib/meteogalicia';
import { msToKmh } from '@/lib/utils';

interface StationDataCardProps {
  station: WeatherStation;
  observation: StationObservation | null;
}

const MAIN_PARAMETERS_DISPLAY = [
  { code: 'TA_AVG_1.5m', label: 'Temperatura', icon: '🌡️', decimals: 1 },
  { code: 'HR_AVG_1.5m', label: 'Humedad', icon: '💧', decimals: 0 },
  { code: 'VV_AVG_10m', label: 'Viento (media)', icon: '💨', decimals: 1, fallback: 'VV_AVG_2m' },
  { code: 'VV_RACHA_10m', label: 'Viento (rachas)', icon: '🌬️', decimals: 1 },
  { code: 'PP_SUM_1.5m', label: 'Precipitación', icon: '🌧️', decimals: 1 },
  { code: 'PR_AVG_1.5m', label: 'Presión', icon: '📊', decimals: 1 },
];

export default function StationDataCard({ station, observation }: StationDataCardProps) {
  const router = useRouter();

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {station.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Altitud: {station.altitude}m
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Última actualización
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatObservationTime(observation.timestamp)}
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/meteo/station/${station.id}`)}
            className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Ver detalles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {MAIN_PARAMETERS_DISPLAY.map((param) => {
          const value = getValue(param.code, param.fallback);
          const unit = getUnit(param.code, param.fallback);

          if (value === null) return null;

          return (
            <div
              key={param.code}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{param.icon}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {param.label}
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value.toFixed(param.decimals)}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                  {unit}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Ver todos los parámetros ({observation.measurements.length})
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {observation.measurements.map((measurement) => {
              // Formatear valor y unidad según el tipo de parámetro
              let displayValue: string;
              let displayUnit: string;

              // Direcciones del viento (DV_*) - Convertir a cardinal
              if (measurement.parameterCode.startsWith('DV_')) {
                displayValue = getWindDirectionFull(measurement.value);
                displayUnit = '';
              }
              // Velocidades del viento (VV_*) - Convertir a km/h
              else if (measurement.parameterCode.startsWith('VV_') && measurement.unit === 'm/s') {
                displayValue = msToKmh(measurement.value).toFixed(1);
                displayUnit = 'km/h';
              }
              // Otros parámetros - Sin conversión
              else {
                displayValue = measurement.value.toFixed(2);
                displayUnit = measurement.unit;
              }

              return (
                <div
                  key={measurement.parameterCode}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700/30 rounded text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {measurement.parameterName}:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {displayValue} {displayUnit}
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}
