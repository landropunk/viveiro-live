'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import UVWidget from '@/components/weather/UVWidget';
import StationsView from '@/components/stations/StationsView';
import type { CurrentWeatherData, WeatherForecast, DailyWeatherData } from '@/types/weather';

type TabType = 'forecast' | 'stations';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('forecast');
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [municipalityData, setMunicipalityData] = useState<DailyWeatherData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    const isManualRefresh = !loading;
    if (isManualRefresh) {
      setRefreshing(true);
      setError(null);
    }

    try {
      // Las cookies de Supabase se envían automáticamente
      // No necesitamos añadir headers manualmente

      // Obtener clima actual
      const currentResponse = await fetch('/api/protected/weather/current', {
        credentials: 'include',
        cache: 'no-store',
      });

        if (currentResponse.status === 401) {
          console.log('Unauthorized, redirecting to login');
          router.push('/auth/login');
          return;
        }

        if (!currentResponse.ok) {
          const errorData = await currentResponse.json();
          console.error('Error fetching current weather:', errorData);
          throw new Error(errorData.message || 'Error al obtener datos del clima actual');
        }

        const currentData = await currentResponse.json();
        console.log('Current weather data received:', currentData);
        setCurrentWeather(currentData.data);

        // Obtener predicción
        const forecastResponse = await fetch('/api/protected/weather/forecast', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!forecastResponse.ok) {
          throw new Error('Error al obtener predicción meteorológica');
        }

        const forecastData = await forecastResponse.json();
        setForecast(forecastData.data);

        // Obtener datos municipales (UV, temperaturas max/min)
        const municipalityResponse = await fetch('/api/protected/weather/municipality', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (municipalityResponse.ok) {
          const municipalityData = await municipalityResponse.json();
          setMunicipalityData(municipalityData.data);
          console.log('Municipality data received:', municipalityData.data);
        } else {
          console.warn('Could not fetch municipality data');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);

        // Establecer mensaje de error formal
        const errorMessage = err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos meteorológicos. Por favor, inténtelo de nuevo más tarde.';

        setError(errorMessage);
        setLoading(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchWeatherData();

    // Actualizar datos cada 15 minutos
    const interval = setInterval(fetchWeatherData, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos meteorológicos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Meteorología de Viveiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Datos en tiempo real de MeteoGalicia
          </p>
        </div>

          {/* Tabs Navigation */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('forecast')}
                className={`
                  whitespace-nowrap border-b-2 pb-4 px-1 text-sm font-medium transition-colors
                  ${
                    activeTab === 'forecast'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Predicción
              </button>
              <button
                onClick={() => setActiveTab('stations')}
                className={`
                  whitespace-nowrap border-b-2 pb-4 px-1 text-sm font-medium transition-colors
                  ${
                    activeTab === 'stations'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Estaciones Meteorológicas
              </button>
            </nav>
          </div>

          {/* Forecast Tab Content */}
          {activeTab === 'forecast' && (
            <>
              {/* Refresh Button */}
              <div className="mb-6 flex justify-end">
                <button
                  onClick={fetchWeatherData}
                  disabled={refreshing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  <svg
                    className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {refreshing ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>

              {error && !currentWeather && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                  <div className="flex flex-col items-center text-center">
                    <svg
                      className="mb-4 h-12 w-12 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-300">
                      Disculpe las molestias
                    </h3>
                    <p className="mb-4 max-w-md text-sm text-red-800 dark:text-red-400">
                      {error}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-500">
                      El servicio de MeteoGalicia puede estar experimentando problemas temporales.
                      Estamos trabajando para resolver esta situación lo antes posible.
                    </p>
                    <button
                      onClick={fetchWeatherData}
                      disabled={refreshing}
                      className="mt-4 flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700 disabled:bg-gray-400"
                    >
                      <svg
                        className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              {currentWeather && (
                <div className="mb-8">
                  <CurrentWeatherCard data={currentWeather} />
                </div>
              )}

              {forecast && forecast.data.length > 0 && (
                <div className="space-y-8">
                  <HourlyForecast data={forecast.data} title="Próximas 12 horas" />

                  <div className="grid gap-8 lg:grid-cols-2">
                    <DailyForecast data={forecast.data} />
                    {municipalityData && municipalityData.length > 0 && (
                      <UVWidget dailyData={municipalityData} />
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Última actualización: {forecast ? (() => {
                        // Normalizar timestamp si es necesario
                        let timestamp = forecast.lastUpdate;
                        if (timestamp.match(/[+-]\d{2}$/)) {
                          timestamp = timestamp + ':00';
                        }
                        return new Date(timestamp).toLocaleString('es-ES');
                      })() : '-'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Datos reales de API V5 MeteoGalicia
                  </span>
                </div>
              </div>
            </>
          )}

        {/* Stations Tab Content */}
        {activeTab === 'stations' && (
          <StationsView />
        )}
      </div>
    </div>
  );
}
