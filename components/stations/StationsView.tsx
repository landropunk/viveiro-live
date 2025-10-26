'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StationObservation, StationComparisonTimeSeries } from '@/types/weather';
import { VIVEIRO_STATIONS } from '@/lib/meteogalicia-stations';
import StationSelector from './StationSelector';
import StationDataCard from './StationDataCard';
import StationComparisonChart from './StationComparisonChart';

// Importación del mapa con Google Maps
const StationsMap = dynamic(() => import('./StationsMap'), {
  ssr: false,
});

interface StationsData {
  observations: StationObservation[];
  timestamp: string;
}

export default function StationsView() {
  const [stationsData, setStationsData] = useState<StationsData | null>(null);
  const [selectedStations, setSelectedStations] = useState<number[]>([10104, 10162]); // Ambas seleccionadas por defecto
  const [comparisonData, setComparisonData] = useState<StationComparisonTimeSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStationsData();
    // Actualizar cada 15 minutos
    const interval = setInterval(fetchStationsData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStations.length > 0) {
      fetchComparisonData();
    }
  }, [selectedStations]);

  const fetchStationsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[StationsView] Fetching data from /api/protected/stations');

      const response = await fetch('/api/protected/stations', {
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('[StationsView] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[StationsView] Error response:', errorData);

        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        throw new Error(
          errorData.message || errorData.error || 'Error al obtener datos de estaciones'
        );
      }

      const data = await response.json();
      console.log('[StationsView] Data received:', {
        observations: data.observations?.length,
      });

      setStationsData(data);
    } catch (err) {
      console.error('[StationsView] Error fetching stations data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchComparisonData = async () => {
    if (selectedStations.length === 0) {
      setComparisonData([]);
      return;
    }

    try {
      setLoadingComparison(true);

      console.log('[StationsView] Fetching comparison data for stations:', selectedStations);

      const stationsParam = selectedStations.join(',');
      const response = await fetch(
        `/api/protected/stations/comparison?stations=${stationsParam}&period=24h`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        console.error('[StationsView] Error fetching comparison data:', response.status);
        return;
      }

      const result = await response.json();
      console.log('[StationsView] Comparison data received:', result.data?.length, 'variables');

      setComparisonData(result.data || []);
    } catch (err) {
      console.error('[StationsView] Error fetching comparison data:', err);
    } finally {
      setLoadingComparison(false);
    }
  };


  if (loading && !stationsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos de estaciones...</p>
        </div>
      </div>
    );
  }

  if (error && !stationsData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Error al cargar datos
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-red-700 dark:text-red-400 hover:underline">
            Detalles técnicos
          </summary>
          <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded text-xs text-red-800 dark:text-red-300 font-mono">
            <p>Endpoint: /api/protected/stations</p>
            <p>Auth: Cookie-based (Supabase)</p>
            <p>Error: {error}</p>
          </div>
        </details>
        <button
          onClick={fetchStationsData}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Reintentando...' : 'Reintentar'}
        </button>
      </div>
    );
  }

  if (!stationsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const selectedObservations = stationsData.observations.filter(obs =>
    selectedStations.includes(obs.stationId)
  );

  return (
    <div className="space-y-6">
      {/* Error warning (if data exists) */}
      {error && stationsData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
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
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                Error al actualizar
              </h3>
              <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-400">
                {error} - Mostrando última versión en caché
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Estaciones Meteorológicas de Viveiro
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Datos en tiempo real de las estaciones de observación
          </p>
        </div>
        <button
          onClick={fetchStationsData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Actualizar
        </button>
      </div>

      {/* Selector de estaciones */}
      <StationSelector
        stations={VIVEIRO_STATIONS}
        selectedStations={selectedStations}
        onSelectionChange={setSelectedStations}
      />

      {/* Mapa de estaciones */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Ubicación de las estaciones
        </h3>
        <StationsMap
          stations={VIVEIRO_STATIONS}
          selectedStations={selectedStations}
          onStationClick={(stationId) => {
            // Toggle selección al hacer clic en el mapa
            if (selectedStations.includes(stationId)) {
              setSelectedStations(selectedStations.filter(id => id !== stationId));
            } else {
              setSelectedStations([...selectedStations, stationId]);
            }
          }}
        />
      </div>

      {selectedStations.length > 0 && (
        <>
          {/* Tarjetas de datos actuales */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Datos actuales
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedObservations.map((observation) => {
                const station = VIVEIRO_STATIONS.find(s => s.id === observation.stationId);
                return station ? (
                  <StationDataCard
                    key={observation.stationId}
                    station={station}
                    observation={observation}
                  />
                ) : null;
              })}
            </div>
          </div>

          {/* Gráficos de comparación histórica (últimas 24 horas) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comparación histórica - Últimas 24 horas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Datos históricos reales de MeteoGalicia
                </p>
              </div>
              {loadingComparison && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Cargando datos históricos...</span>
                </div>
              )}
            </div>

            {comparisonData.length > 0 ? (
              <StationComparisonChart
                comparisonData={comparisonData}
                selectedStations={selectedStations}
              />
            ) : !loadingComparison ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No hay datos de comparación disponibles
                </p>
              </div>
            ) : null}
          </div>
        </>
      )}

      {selectedStations.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            Selecciona al menos una estación para ver los datos
          </p>
        </div>
      )}
    </div>
  );
}
