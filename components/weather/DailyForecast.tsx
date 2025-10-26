'use client';

import { WeatherDataPoint } from '@/types/weather';
import Image from 'next/image';

interface DailyForecastProps {
  data: WeatherDataPoint[];
}

export default function DailyForecast({ data }: DailyForecastProps) {
  // Agrupar datos por día
  const dailyData = groupByDay(data);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-950">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Pronóstico por días
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dailyData.map((day, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 dark:border-gray-700 dark:from-blue-950 dark:to-gray-900"
          >
            {/* Día */}
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {day.dayName}
            </p>

            {/* Períodos del día */}
            <div className="grid grid-cols-3 gap-2">
              {/* Mañana */}
              {day.morning && (
                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs text-gray-500">Mañana</p>
                  {day.morning.skyStateIcon && (
                    <Image
                      src={day.morning.skyStateIcon}
                      alt={day.morning.skyState}
                      width={32}
                      height={32}
                      className="mb-1 h-8 w-8"
                    />
                  )}
                  <p className="text-sm font-bold">{Math.round(day.morning.temperature)}°</p>
                  {day.morning.precipitation > 0 && (
                    <p className="text-xs text-blue-600">{day.morning.precipitation.toFixed(1)}mm</p>
                  )}
                </div>
              )}

              {/* Tarde */}
              {day.afternoon && (
                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs text-gray-500">Tarde</p>
                  {day.afternoon.skyStateIcon && (
                    <Image
                      src={day.afternoon.skyStateIcon}
                      alt={day.afternoon.skyState}
                      width={32}
                      height={32}
                      className="mb-1 h-8 w-8"
                    />
                  )}
                  <p className="text-sm font-bold">{Math.round(day.afternoon.temperature)}°</p>
                  {day.afternoon.precipitation > 0 && (
                    <p className="text-xs text-blue-600">{day.afternoon.precipitation.toFixed(1)}mm</p>
                  )}
                </div>
              )}

              {/* Noche */}
              {day.night && (
                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs text-gray-500">Noche</p>
                  {day.night.skyStateIcon && (
                    <Image
                      src={day.night.skyStateIcon}
                      alt={day.night.skyState}
                      width={32}
                      height={32}
                      className="mb-1 h-8 w-8"
                    />
                  )}
                  <p className="text-sm font-bold">{Math.round(day.night.temperature)}°</p>
                  {day.night.precipitation > 0 && (
                    <p className="text-xs text-blue-600">{day.night.precipitation.toFixed(1)}mm</p>
                  )}
                </div>
              )}
            </div>

            {/* Resumen del día */}
            <div className="mt-3 space-y-1 border-t border-gray-200 pt-2 text-xs dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Max: <span className="font-semibold text-red-600">{Math.round(day.tempMax)}°</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Min: <span className="font-semibold text-blue-600">{Math.round(day.tempMin)}°</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DayData {
  dayName: string;
  date: Date;
  morning: WeatherDataPoint | null;
  afternoon: WeatherDataPoint | null;
  night: WeatherDataPoint | null;
  tempMax: number;
  tempMin: number;
}

function groupByDay(data: WeatherDataPoint[]): DayData[] {
  const days = new Map<string, WeatherDataPoint[]>();

  // Agrupar por día
  data.forEach((point) => {
    let ts = point.timestamp;
    if (ts.match(/[+-]\d{2}$/)) {
      ts = ts + ':00';
    }
    const date = new Date(ts);
    const dayKey = date.toDateString();

    if (!days.has(dayKey)) {
      days.set(dayKey, []);
    }
    days.get(dayKey)!.push(point);
  });

  // Convertir a array de días
  const result: DayData[] = [];
  let dayIndex = 0;

  days.forEach((points, dayKey) => {
    const date = new Date(dayKey);
    const dayName = dayIndex === 0 ? 'Hoy' :
                    dayIndex === 1 ? 'Mañana' :
                    date.toLocaleDateString('es-ES', { weekday: 'short' });

    // Encontrar datos por período del día
    const morning = points.find(p => {
      let ts = p.timestamp;
      if (ts.match(/[+-]\d{2}$/)) ts = ts + ':00';
      const hour = new Date(ts).getHours();
      return hour >= 6 && hour < 12;
    }) || null;

    const afternoon = points.find(p => {
      let ts = p.timestamp;
      if (ts.match(/[+-]\d{2}$/)) ts = ts + ':00';
      const hour = new Date(ts).getHours();
      return hour >= 12 && hour < 20;
    }) || null;

    const night = points.find(p => {
      let ts = p.timestamp;
      if (ts.match(/[+-]\d{2}$/)) ts = ts + ':00';
      const hour = new Date(ts).getHours();
      return hour >= 20 || hour < 6;
    }) || null;

    const temps = points.map(p => p.temperature);
    const tempMax = Math.max(...temps);
    const tempMin = Math.min(...temps);

    result.push({
      dayName,
      date,
      morning,
      afternoon,
      night,
      tempMax,
      tempMin,
    });

    dayIndex++;
  });

  return result.slice(0, 4); // Mostrar solo 4 días
}
