'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import StationDetailCard from '@/components/stations/StationDetailCard';
import HistoricalChart from '@/components/stations/HistoricalChart';
import VariableSelector from '@/components/stations/VariableSelector';
import { getStationInfo } from '@/lib/meteogalicia-stations';
import type { StationObservation, WeatherVariable } from '@/types/weather';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function StationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const stationId = parseInt(params?.id as string);

  const [observation, setObservation] = useState<StationObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<WeatherVariable[]>([
    'TA_AVG_1.5m',
    'HR_AVG_1.5m',
    'VV_RACHA_10m',
    'PP_SUM_1.5m',
  ]);

  const station = getStationInfo(stationId);

  useEffect(() => {
    if (!stationId || isNaN(stationId)) {
      setError('ID de estación inválido');
      setLoading(false);
      return;
    }

    fetchStationData();

    // Actualizar datos cada 10 minutos
    const interval = setInterval(fetchStationData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [stationId]);

  const fetchStationData = async () => {
    try {
      const response = await fetch(`/api/protected/stations/${stationId}`, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al obtener datos de la estación');
      }

      const data = await response.json();
      setObservation(data.observation);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching station data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando datos de la estación...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !station) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Estación no encontrada'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Botón de volver */}
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Estación Meteorológica: {station.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Datos en tiempo real y históricos de MeteoGalicia
            </p>
          </div>

          {/* Tarjeta de datos actuales */}
          <div className="mb-8">
            <StationDetailCard station={station} observation={observation} />
          </div>

          {/* Selector de variables y gráficas históricas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gráficas Históricas
              </h2>
              <VariableSelector
                selectedVariables={selectedVariables}
                onVariablesChange={setSelectedVariables}
                maxSelection={4}
              />
            </div>

            {selectedVariables.length > 0 ? (
              <HistoricalChart
                stationId={stationId}
                selectedVariables={selectedVariables}
                initialPeriod="24h"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Selecciona al menos una variable para visualizar los datos históricos
                </p>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ubicación
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Latitud:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {station.latitude.toFixed(6)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {station.longitude.toFixed(6)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Altitud:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {station.altitude} m
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actualización
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span>Datos en tiempo real</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Actualización automática cada 10 minutos
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fuente de Datos
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  MeteoGalicia
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Red de estaciones meteorológicas de Galicia
                </p>
                <a
                  href={`https://www.meteogalicia.gal/web/observacion/rede-meteoroloxica?idEstacion=${stationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Ver en MeteoGalicia
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Los datos meteorológicos son proporcionados por MeteoGalicia y se actualizan automáticamente.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
