'use client';

import { useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { WeatherStation } from '@/types/weather';

interface StationsMapProps {
  stations: WeatherStation[];
  selectedStations?: number[];
  onStationClick?: (stationId: number) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

// Centro por defecto: punto medio entre las estaciones de Viveiro
const defaultCenter = {
  lat: 43.645,
  lng: -7.596,
};

function StationsMap({
  stations,
  selectedStations = [],
  onStationClick,
  center = defaultCenter,
  zoom = 12,
}: StationsMapProps) {
  const [activeStation, setActiveStation] = useState<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Ajustar bounds para mostrar todas las estaciones
    const bounds = new google.maps.LatLngBounds();
    stations.forEach(station => {
      bounds.extend({ lat: station.latitude, lng: station.longitude });
    });
    map.fitBounds(bounds);
  }, [stations]);

  if (loadError) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error al cargar Google Maps</p>
          <p className="mt-2 text-sm text-red-500 dark:text-red-500">
            Por favor, verifica la configuración de la API Key
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {stations.map((station) => {
          const isSelected = selectedStations.includes(station.id);

          return (
            <Marker
              key={station.id}
              position={{ lat: station.latitude, lng: station.longitude }}
              title={station.name}
              onClick={() => {
                setActiveStation(station.id);
                if (onStationClick) {
                  onStationClick(station.id);
                }
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: isSelected ? '#10b981' : '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            >
              {activeStation === station.id && (
                <InfoWindow
                  position={{ lat: station.latitude, lng: station.longitude }}
                  onCloseClick={() => setActiveStation(null)}
                >
                  <div className="p-2">
                    <h3 className="mb-2 text-base font-bold text-gray-900">
                      {station.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">ID:</span> {station.id}
                      </p>
                      <p>
                        <span className="font-medium">Altitud:</span> {station.altitude}m
                      </p>
                      <p>
                        <span className="font-medium">Coordenadas:</span>
                        <br />
                        {station.latitude.toFixed(6)}°N, {Math.abs(station.longitude).toFixed(6)}°O
                      </p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-800/95">
        <h4 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          Estaciones
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: '#3b82f6' }}
            ></div>
            <span className="text-gray-600 dark:text-gray-400">Disponible</span>
          </div>
          {selectedStations.length > 0 && (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: '#10b981' }}
              ></div>
              <span className="text-gray-600 dark:text-gray-400">Seleccionada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(StationsMap);
