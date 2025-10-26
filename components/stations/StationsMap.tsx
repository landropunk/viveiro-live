'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherStation } from '@/types/weather';

// Fix para iconos de Leaflet en Next.js
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 16px;
          transform: rotate(45deg);
          font-weight: bold;
        ">🌡️</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const stationIcon = createCustomIcon('#3b82f6'); // blue-500

interface StationsMapProps {
  stations: WeatherStation[];
  selectedStations?: number[];
  onStationClick?: (stationId: number) => void;
  center?: [number, number];
  zoom?: number;
}

// Componente para ajustar la vista del mapa
function MapBounds({ stations }: { stations: WeatherStation[] }) {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      const bounds = L.latLngBounds(
        stations.map(station => [station.latitude, station.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stations, map]);

  return null;
}

export default function StationsMap({
  stations,
  selectedStations = [],
  onStationClick,
  center,
  zoom = 12,
}: StationsMapProps) {
  // Centro por defecto: punto medio entre las estaciones de Viveiro
  const defaultCenter: [number, number] = center || [43.645, -7.596];

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds stations={stations} />

        {stations.map((station) => {
          const isSelected = selectedStations.includes(station.id);
          const icon = isSelected
            ? createCustomIcon('#10b981') // green-500 para seleccionadas
            : stationIcon;

          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onStationClick) {
                    onStationClick(station.id);
                  }
                },
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-2">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {station.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
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
                  {onStationClick && (
                    <button
                      onClick={() => onStationClick(station.id)}
                      className="mt-3 w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                    >
                      Ver detalles
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-800/95">
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
