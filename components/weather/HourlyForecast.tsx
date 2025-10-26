'use client';

import { WeatherDataPoint } from '@/types/weather';
import { getWindDirectionFull } from '@/lib/meteogalicia';
import Image from 'next/image';

interface HourlyForecastProps {
  data: WeatherDataPoint[];
  title?: string;
}

export default function HourlyForecast({ data, title = 'Próximas horas' }: HourlyForecastProps) {
  // Mostrar las próximas 12 horas
  const hourlyData = data.slice(0, 12);

  const formatHour = (timestamp: string) => {
    let ts = timestamp;
    if (ts.match(/[+-]\d{2}$/)) {
      ts = ts + ':00';
    }
    const date = new Date(ts);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-950">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {hourlyData.map((point, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
          >
            {/* Hora */}
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {formatHour(point.timestamp)}
            </p>

            {/* Icono del estado del cielo */}
            {point.skyStateIcon ? (
              <div className="mb-2">
                <Image
                  src={point.skyStateIcon}
                  alt={point.skyState}
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
            ) : (
              <div className="mb-2 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            )}

            {/* Temperatura */}
            <p className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(point.temperature)}°
            </p>

            {/* Precipitación */}
            {point.precipitation > 0 && (
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                {point.precipitation.toFixed(1)}mm
              </div>
            )}

            {/* Viento */}
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: `rotate(${point.windDirection + 180}deg)` }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
              <span>{getWindDirectionFull(point.windDirection)} {Math.round(point.windSpeed)} km/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
