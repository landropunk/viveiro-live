'use client';

import { useState } from 'react';
import type { WeatherVariable } from '@/types/weather';
import { HISTORICAL_VARIABLES } from '@/lib/meteogalicia-historical-real';

interface VariableSelectorProps {
  selectedVariables: WeatherVariable[];
  onVariablesChange: (variables: WeatherVariable[]) => void;
  maxSelection?: number;
}

export default function VariableSelector({
  selectedVariables,
  onVariablesChange,
  maxSelection = 4,
}: VariableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVariable = (variable: WeatherVariable) => {
    const isSelected = selectedVariables.includes(variable);

    if (isSelected) {
      // Remover variable
      onVariablesChange(selectedVariables.filter((v) => v !== variable));
    } else {
      // Agregar variable si no se excede el máximo
      if (selectedVariables.length < maxSelection) {
        onVariablesChange([...selectedVariables, variable]);
      }
    }
  };

  const clearAll = () => {
    onVariablesChange([]);
  };

  const selectDefault = () => {
    onVariablesChange(['TA_AVG_1.5m', 'HR_AVG_1.5m', 'VV_RACHA_10m', 'PP_SUM_1.5m']);
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Variables ({selectedVariables.length}/{maxSelection})
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Panel de selección */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú desplegable */}
          <div className="absolute left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
            {/* Encabezado */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Seleccionar Variables
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Máx. {maxSelection}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={selectDefault}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Por defecto
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            </div>

            {/* Lista de variables */}
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(HISTORICAL_VARIABLES).map(([code, variable]) => {
                if (!variable) return null; // Saltar variables no disponibles

                const isSelected = selectedVariables.includes(code as WeatherVariable);
                const isDisabled = !isSelected && selectedVariables.length >= maxSelection;

                return (
                  <button
                    key={code}
                    onClick={() => !isDisabled && toggleVariable(code as WeatherVariable)}
                    disabled={isDisabled}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Indicador de color */}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: variable.color }}
                    />

                    {/* Información de la variable */}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {variable.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unidad: {variable.unit}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pie de página con variables seleccionadas */}
            {selectedVariables.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Variables seleccionadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVariables.map((code) => {
                    const variable = HISTORICAL_VARIABLES[code];
                    if (!variable) return null; // Saltar variables no disponibles

                    return (
                      <div
                        key={code}
                        className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: variable.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {variable.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVariable(code);
                          }}
                          className="ml-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
