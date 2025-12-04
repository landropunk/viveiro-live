'use client';

import { useState } from 'react';
import { Cookie, Settings, X } from 'lucide-react';
import { CookieSettings } from './CookieSettings';

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onOpenSettings: () => void;
}

export function CookieBanner({ onAcceptAll, onRejectAll, onOpenSettings }: CookieBannerProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Icono y texto */}
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Uso de Cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Utilizamos cookies propias y de terceros para mejorar nuestros servicios y
                  mostrar publicidad relacionada con sus preferencias mediante el análisis de
                  sus hábitos de navegación.
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Configurar
              </button>
              <button
                onClick={onRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={onAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
              >
                Aceptar todas
              </button>
            </div>
          </div>

          {/* Enlace a política de privacidad */}
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Para más información, consulta nuestra{' '}
            <a
              href="/politica-privacidad"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Política de Privacidad
            </a>{' '}
            y{' '}
            <a
              href="/politica-cookies"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Política de Cookies
            </a>
            .
          </div>
        </div>
      </div>

      {/* Modal de configuración */}
      {showSettings && (
        <CookieSettings
          onClose={() => setShowSettings(false)}
          onAcceptSelected={onOpenSettings}
        />
      )}
    </>
  );
}
