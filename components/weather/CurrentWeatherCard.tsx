'use client';

import { CurrentWeatherData } from '@/types/weather';
import { getWindDirectionFull } from '@/lib/meteogalicia';
import Image from 'next/image';

interface CurrentWeatherCardProps {
  data: CurrentWeatherData;
}

export default function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  let timestamp = data.timestamp;
  if (timestamp.match(/[+-]\d{2}$/)) {
    timestamp = timestamp + ':00';
  }

  const formattedTime = new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = new Date(timestamp).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg dark:border-gray-700 dark:from-blue-950 dark:to-blue-900">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Clima Actual en Viveiro
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {formattedDate} • {formattedTime}
        </p>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-7xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.temperature)}
            </span>
            <span className="ml-2 text-4xl font-medium text-gray-600 dark:text-gray-400">
              °C
            </span>
          </div>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Sensación térmica: {Math.round(data.feelsLike)}°C
          </p>
        </div>

        <div className="text-center">
          {data.skyStateIcon && (
            <div className="mb-2 rounded-full bg-white/70 p-4 dark:bg-gray-800/70">
              <Image
                src={data.skyStateIcon}
                alt={data.skyState}
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>
          )}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {data.skyState}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Viento */}
        <div className="rounded-xl bg-white/70 p-5 text-center dark:bg-gray-800/70">
          <svg
            className="mx-auto mb-2 h-8 w-8 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Viento
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(data.windSpeed)}
          </p>
          <p className="text-xs text-gray-500">km/h</p>
          <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            {getWindDirectionFull(data.windDirection)}
          </p>
        </div>

        {/* Precipitación */}
        <div className="rounded-xl bg-white/70 p-5 text-center dark:bg-gray-800/70">
          <svg
            className="mx-auto mb-2 h-8 w-8 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.25c-.61 0-1.11.5-1.11 1.11 0 .32.14.61.36.81l4.8 5.4c1.49 1.67 2.45 3.89 2.45 6.33 0 3.45-2.8 6.25-6.25 6.25S5 19.35 5 15.9c0-2.44.96-4.66 2.45-6.33l4.8-5.4c.22-.2.36-.49.36-.81 0-.61-.5-1.11-1.11-1.11zm0 2.76l-3.58 4.03C7.18 10.58 6.5 12.18 6.5 15.9c0 2.65 2.15 4.75 4.75 4.75s4.75-2.1 4.75-4.75c0-1.72-.68-3.32-1.92-4.86L12 5.01z" />
            <path d="M4.5 3.5c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm0 4c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm15 0c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm0-4c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75z" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Precipitación
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {data.precipitation.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">mm</p>
        </div>

        {/* Humedad */}
        {data.humidity !== undefined && (
          <div className="rounded-xl bg-white/70 p-5 text-center dark:bg-gray-800/70">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-cyan-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69zm0 2.83l-4.24 4.24a6 6 0 1 0 8.48 0L12 5.52z" />
            </svg>
            <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              Humedad
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.humidity)}
            </p>
            <p className="text-xs text-gray-500">%</p>
          </div>
        )}

        {/* Temperatura */}
        <div className="rounded-xl bg-white/70 p-5 text-center dark:bg-gray-800/70">
          <svg
            className="mx-auto mb-2 h-8 w-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 15a3 3 0 1 0 6 0c0-1-1-1.5-1-2.5V6a2 2 0 1 0-4 0v6.5c0 1-1 1.5-1 2.5zm3-13a4 4 0 0 1 4 4v6.5c.6.5 1.7 1.9 1.7 3.5a5.7 5.7 0 0 1-11.4 0c0-1.6 1.1-3 1.7-3.5V6a4 4 0 0 1 4-4z" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Temperatura
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(data.temperature)}°
          </p>
          <p className="text-xs text-gray-500">grados</p>
        </div>
      </div>
    </div>
  );
}
