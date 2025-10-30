'use client';

import { useState, useEffect } from 'react';
import { getLastHoursData, type HourlyStationData } from '@/lib/meteogalicia-hourly-historical';
import { VIVEIRO_STATIONS } from '@/lib/meteogalicia-stations';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistoricosPage() {
  const [data, setData] = useState<Map<number, HourlyStationData[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState(24);
  const [selectedParameter, setSelectedParameter] = useState<'temperature' | 'humidity' | 'windSpeed' | 'precipitation'>('temperature');

  useEffect(() => {
    loadData();
  }, [selectedHours]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const historicalData = await getLastHoursData(selectedHours);
      setData(historicalData);
    } catch (err) {
      console.error('Error cargando datos históricos:', err);
      setError('Error al cargar los datos históricos');
    } finally {
      setLoading(false);
    }
  };

  const getParameterLabel = () => {
    switch (selectedParameter) {
      case 'temperature': return 'Temperatura (°C)';
      case 'humidity': return 'Humedad (%)';
      case 'windSpeed': return 'Viento (km/h)';
      case 'precipitation': return 'Precipitación (mm)';
    }
  };

  const getParameterColor = (stationId: number) => {
    return stationId === 10104 ? '#3b82f6' : '#10b981'; // Azul y Verde
  };

  const prepareChartData = () => {
    if (data.size === 0) return [];

    // Combinar datos de todas las estaciones por timestamp
    const timestampMap = new Map<string, any>();

    data.forEach((stationData, stationId) => {
      const station = VIVEIRO_STATIONS.find(s => s.id === stationId);
      if (!station) return;

      stationData.forEach((point) => {
        const timestamp = point.timestamp;
        let entry = timestampMap.get(timestamp);

        if (!entry) {
          entry = {
            timestamp,
            formattedTime: formatTimestamp(timestamp),
          };
          timestampMap.set(timestamp, entry);
        }

        entry[`${station.name}_${selectedParameter}`] = point[selectedParameter];
      });
    });

    return Array.from(timestampMap.values()).sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'HH:mm dd/MM', { locale: es });
    } catch {
      return timestamp;
    }
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos históricos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Datos Históricos Horarios
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Consulta y analiza los datos meteorológicos históricos de las estaciones de Viveiro
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-4">
        {/* Selector de horas */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Período
          </label>
          <select
            value={selectedHours}
            onChange={(e) => setSelectedHours(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value={6}>Últimas 6 horas</option>
            <option value={12}>Últimas 12 horas</option>
            <option value={24}>Últimas 24 horas</option>
            <option value={48}>Últimas 48 horas</option>
            <option value={72}>Últimas 72 horas</option>
          </select>
        </div>

        {/* Selector de parámetro */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Parámetro
          </label>
          <select
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value as any)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="temperature">Temperatura</option>
            <option value="humidity">Humedad</option>
            <option value="windSpeed">Velocidad del Viento</option>
            <option value="precipitation">Precipitación</option>
          </select>
        </div>

        {/* Botón actualizar */}
        <div className="flex items-end">
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {getParameterLabel()} - Últimas {selectedHours}h
        </h2>

        {chartData.length === 0 ? (
          <div className="flex h-96 items-center justify-center text-gray-500">
            No hay datos disponibles para el período seleccionado
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="formattedTime"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              {VIVEIRO_STATIONS.map((station) => (
                <Line
                  key={station.id}
                  type="monotone"
                  dataKey={`${station.name}_${selectedParameter}`}
                  name={station.name}
                  stroke={getParameterColor(station.id)}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tarjetas de resumen por estación */}
      <div className="grid gap-6 md:grid-cols-2">
        {VIVEIRO_STATIONS.map((station) => {
          const stationData = data.get(station.id) || [];
          const latestData = stationData[stationData.length - 1];

          return (
            <div
              key={station.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {station.name}
              </h3>

              {!latestData ? (
                <p className="text-sm text-gray-500">No hay datos disponibles</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      🌡️ Temperatura
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {latestData.temperature?.toFixed(1)}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      💧 Humedad
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {latestData.humidity?.toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      💨 Viento
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {latestData.windSpeed?.toFixed(1)} km/h
                    </span>
                  </div>

                  {latestData.precipitation !== undefined && latestData.precipitation > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        🌧️ Precipitación
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {latestData.precipitation?.toFixed(1)} mm
                      </span>
                    </div>
                  )}

                  <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Última actualización: {formatTimestamp(latestData.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Altitud: {station.altitude}m
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/10">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">
          ℹ️ Acerca de estos datos
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Los datos históricos horarios provienen directamente de las estaciones meteorológicas
          automáticas de MeteoGalicia ubicadas en Viveiro. Los datos se actualizan cada hora y
          muestran las mediciones reales registradas por los sensores.
        </p>
      </div>
    </div>
  );
}
