'use client';

import { WeatherStation } from '@/types/weather';

interface StationSelectorProps {
  stations: WeatherStation[];
  selectedStations: number[];
  onSelectionChange: (stationIds: number[]) => void;
}

export default function StationSelector({
  stations,
  selectedStations,
  onSelectionChange,
}: StationSelectorProps) {
  const handleToggleStation = (stationId: number) => {
    if (selectedStations.includes(stationId)) {
      onSelectionChange(selectedStations.filter(id => id !== stationId));
    } else {
      onSelectionChange([...selectedStations, stationId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(stations.map(s => s.id));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Estaciones meteorológicas
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Todas
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Ninguna
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {stations.map((station) => {
          const isSelected = selectedStations.includes(station.id);
          return (
            <div
              key={station.id}
              onClick={() => handleToggleStation(station.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {station.name}
                  </h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Altitud: {station.altitude}m
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {station.latitude.toFixed(6)}°N, {Math.abs(station.longitude).toFixed(6)}°O
                    </p>
                  </div>
                </div>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStations.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {selectedStations.length === 1
              ? '1 estación seleccionada'
              : `${selectedStations.length} estaciones seleccionadas`}
          </p>
        </div>
      )}
    </div>
  );
}
