'use client';

import { ExternalLink, Calendar, Database, TrendingUp } from 'lucide-react';

export default function HistoricalDataSection() {
  const handleOpenHistoricos = () => {
    window.open(
      'https://www.meteogalicia.gal/web/observacion/rede-meteoroloxica/historico',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700 p-6">
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Datos Históricos Completos
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Accede a los históricos oficiales de MeteoGalicia con datos desde 2005
          </p>

          {/* Información de disponibilidad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Penedo do Galo (545m)
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Diezminutales: desde 02/06/2005</li>
                <li>• Horarias: desde 01/01/2006</li>
                <li>• Diarias y Mensuales disponibles</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Borreiros (59m)
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Diezminutales: desde 02/06/2014</li>
                <li>• Horarias: desde 01/07/2014</li>
                <li>• Diarias y Mensuales disponibles</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                Variables disponibles
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Temperatura</li>
                <li>• Humedad y Precipitación</li>
                <li>• Viento y Radiación Solar</li>
              </ul>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenHistoricos}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-5 h-5" />
              Abrir Históricos Oficiales
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 px-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Se abrirá en nueva pestaña</span>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Nota:</strong> Los datos históricos se consultan directamente en la interfaz oficial de
              MeteoGalicia. Puedes descargar los datos en formato CSV para análisis personalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
