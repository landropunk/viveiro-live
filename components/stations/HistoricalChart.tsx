'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type {
  HistoricalTimeSeries,
  HistoricalPeriod,
  WeatherVariable,
} from '@/types/weather';
import { HISTORICAL_VARIABLES } from '@/lib/meteogalicia-historical-real';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoricalChartProps {
  stationId: number;
  initialPeriod?: HistoricalPeriod;
  selectedVariables?: WeatherVariable[];
}

export default function HistoricalChart({
  stationId,
  initialPeriod = '24h',
  selectedVariables = ['TA_AVG_1.5m', 'HR_AVG_1.5m', 'VV_RACHA_10m', 'PP_SUM_1.5m'],
}: HistoricalChartProps) {
  const [period, setPeriod] = useState<HistoricalPeriod>(initialPeriod);
  const [variables, setVariables] = useState<WeatherVariable[]>(selectedVariables);
  const [data, setData] = useState<HistoricalTimeSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar estado interno cuando cambia selectedVariables desde el padre
  useEffect(() => {
    setVariables(selectedVariables);
  }, [selectedVariables]);

  useEffect(() => {
    fetchHistoricalData();
  }, [stationId, period, variables]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const variablesParam = variables.join(',');
      const response = await fetch(
        `/api/protected/stations/${stationId}/historical?period=${period}&variables=${variablesParam}`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar datos históricos');
      }

      const result = await response.json();
      setData(result.variables || []);
    } catch (err) {
      console.error('Error cargando datos históricos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para el gráfico
  const chartData = prepareChartData(data);

  // Calcular estadísticas
  const stats = calculateStats(data);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-400">
            Cargando datos históricos...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchHistoricalData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      {/* Encabezado con selector de período */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Datos Históricos
        </h3>
        <div className="flex gap-2">
          {(['24h', '48h', '72h'] as HistoricalPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {p === '24h' ? '24h' : p === '48h' ? '2 días' : '3 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.variable}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Min: {stat.min.toFixed(1)} {stat.unit}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Max: {stat.max.toFixed(1)} {stat.unit}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Prom: {stat.avg.toFixed(1)} {stat.unit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Gráfico */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => formatTimestamp(value, period)}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              content={<CustomTooltip period={period} />}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
            />
            {data.map((series) => {
              const variable = HISTORICAL_VARIABLES[series.parameterCode as WeatherVariable];
              return (
                <Line
                  key={series.parameterCode}
                  type="monotone"
                  dataKey={series.parameterCode}
                  name={`${series.parameterName} (${series.unit})`}
                  stroke={variable?.color || '#3b82f6'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda de variables */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Variables visualizadas:
        </p>
        <div className="flex flex-wrap gap-2">
          {data.map((series) => {
            const variable = HISTORICAL_VARIABLES[series.parameterCode as WeatherVariable];
            return (
              <div
                key={series.parameterCode}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: variable?.color || '#3b82f6' }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {series.parameterName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Prepara los datos para el gráfico combinando todas las series temporales
 */
function prepareChartData(series: HistoricalTimeSeries[]): any[] {
  if (series.length === 0) return [];

  // Obtener todos los timestamps únicos
  const timestampSet = new Set<string>();
  series.forEach((s) => {
    s.data.forEach((d) => timestampSet.add(d.timestamp));
  });

  const timestamps = Array.from(timestampSet).sort();

  // Crear un objeto por cada timestamp con todas las variables
  return timestamps.map((timestamp) => {
    const dataPoint: any = { timestamp };

    series.forEach((s) => {
      const value = s.data.find((d) => d.timestamp === timestamp)?.value;
      dataPoint[s.parameterCode] = value;
    });

    return dataPoint;
  });
}

/**
 * Calcula estadísticas (min, max, avg) para cada serie
 */
function calculateStats(series: HistoricalTimeSeries[]): Array<{
  variable: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  avg: number;
}> {
  return series.map((s) => {
    const values = s.data.map((d) => d.value);
    const sum = values.reduce((acc, v) => acc + v, 0);

    return {
      variable: s.parameterCode,
      label: s.parameterName,
      unit: s.unit,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
    };
  });
}

/**
 * Formatea el timestamp según el período
 */
function formatTimestamp(timestamp: string, period: HistoricalPeriod): string {
  const date = new Date(timestamp);

  if (period === '24h') {
    return format(date, 'HH:mm', { locale: es });
  } else if (period === '48h') {
    return format(date, 'dd/MM HH:mm', { locale: es });
  } else {
    // 72h
    return format(date, 'dd/MM HH:mm', { locale: es });
  }
}

/**
 * Tooltip personalizado para el gráfico
 */
function CustomTooltip({ active, payload, label, period }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const date = new Date(label);
  const formattedDate = format(date, "dd 'de' MMMM, HH:mm", { locale: es });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {formattedDate}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {entry.name}: <span className="font-semibold">{entry.value?.toFixed(1)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
