'use client';

import { DailyWeatherData } from '@/types/weather';

interface UVWidgetProps {
  dailyData: DailyWeatherData[];
}

export default function UVWidget({ dailyData }: UVWidgetProps) {
  if (!dailyData || dailyData.length === 0) {
    return null;
  }

  const getUVLevel = (uvIndex: number): { level: string; color: string; textColor: string } => {
    if (uvIndex <= 2) return { level: 'Bajo', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' };
    if (uvIndex <= 5) return { level: 'Moderado', color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' };
    if (uvIndex <= 7) return { level: 'Alto', color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' };
    if (uvIndex <= 10) return { level: 'Muy Alto', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' };
    return { level: 'Extremo', color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' };
  };

  // Mostrar solo los próximos 3 días
  const displayData = dailyData.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Índice UV
        </h3>
        <svg
          className="h-6 w-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      </div>

      <div className="space-y-3">
        {displayData.map((day, index) => {
          const uvInfo = getUVLevel(day.uvMax);
          const date = new Date(day.date);
          const dayName = index === 0 ? 'Hoy' :
                         index === 1 ? 'Mañana' :
                         date.toLocaleDateString('es-ES', { weekday: 'short' });

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
            >
              <div className="flex items-center gap-4">
                <div className="w-16">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {dayName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${uvInfo.color}`} />
                  <span className={`text-sm font-medium ${uvInfo.textColor}`}>
                    {uvInfo.level}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {day.uvMax}
                </span>
                <span className="text-sm text-gray-500">
                  UV
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Recomendación:</span> Use protección solar cuando el índice UV sea 3 o superior.
        </p>
      </div>
    </div>
  );
}
