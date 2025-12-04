'use client';

import { useState } from 'react';
import { Calendar, Database, RefreshCw } from 'lucide-react';
import { VIVEIRO_STATIONS } from '@/lib/meteogalicia-stations';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface HistoricalDataPoint {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
  pressure?: number;
  [key: string]: any;
}

export default function HistoricosPage() {
  const [selectedStation, setSelectedStation] = useState<number>(10104);
  const [startDate, setStartDate] = useState<string>('');
  const [numHours, setNumHours] = useState<number>(12);
  const [selectedParameter, setSelectedParameter] = useState<string>('temperature');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HistoricalDataPoint[]>([]);

  // Parámetros disponibles
  const parameters = [
    { value: 'temperature', label: 'Temperatura (°C)', key: 'temperature' },
    { value: 'humidity', label: 'Humedad (%)', key: 'humidity' },
    { value: 'precipitation', label: 'Precipitación (mm)', key: 'precipitation' },
    { value: 'windSpeed', label: 'Velocidad del Viento (km/h)', key: 'windSpeed' },
    { value: 'pressure', label: 'Presión (hPa)', key: 'pressure' },
  ];

  const handleFetchData = async () => {
    if (!startDate) {
      setError('Por favor selecciona una fecha de inicio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Formatear fecha a DD/MM/YYYY HH:MM
      const date = new Date(startDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hours}:00`;

      const url = `/api/protected/stations/historical?stationId=${selectedStation}&startDateTime=${encodeURIComponent(formattedDate)}&numHours=${numHours}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener datos históricos');
      }

      const result = await response.json();
      setData(result.data || []);

      if (!result.data || result.data.length === 0) {
        setError('No hay datos disponibles para el período seleccionado.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para el gráfico
  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: parameters.find(p => p.value === selectedParameter)?.label || selectedParameter,
        data: data.map(d => d[selectedParameter]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd/MM',
          },
        },
        title: {
          display: true,
          text: 'Fecha y Hora',
        },
      },
      y: {
        title: {
          display: true,
          text: parameters.find(p => p.value === selectedParameter)?.label || '',
        },
      },
    },
  };

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

      {/* Formulario de consulta */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Consulta Personalizada de Datos Históricos
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Selecciona los parámetros de consulta para obtener datos históricos específicos
        </p>

        {/* Grid de controles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Estación */}
          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estación
            </label>
            <select
              id="station"
              value={selectedStation}
              onChange={(e) => setSelectedStation(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              {VIVEIRO_STATIONS.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.altitude}m)
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha y Hora de Inicio
            </label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Número de Horas */}
          <div>
            <label htmlFor="numHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número de Horas
            </label>
            <select
              id="numHours"
              value={numHours}
              onChange={(e) => setNumHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value={4}>4 horas</option>
              <option value={6}>6 horas</option>
              <option value={12}>12 horas</option>
            </select>
          </div>

          {/* Parámetro */}
          <div>
            <label htmlFor="parameter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parámetro
            </label>
            <select
              id="parameter"
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              {parameters.map(param => (
                <option key={param.value} value={param.value}>
                  {param.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón de Consulta */}
        <button
          onClick={handleFetchData}
          disabled={loading || !startDate}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Consultando...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Consultar Datos
            </>
          )}
        </button>

        {/* Mensaje de Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Gráfico */}
        {data.length > 0 && (
          <div className="mt-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Total de Lecturas</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.length}</p>
              </div>

              {data.length > 0 && (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-900 dark:text-green-300">Valor Mínimo</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.min(...data.map(d => d[selectedParameter]).filter(v => v !== undefined && v !== null)).toFixed(1)}
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Valor Máximo</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.max(...data.map(d => d[selectedParameter]).filter(v => v !== undefined && v !== null)).toFixed(1)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
