'use client';

import { useState } from 'react';
import { X, Check, Info } from 'lucide-react';
import type { CookieConsent } from '@/lib/cookies';

interface CookieSettingsProps {
  onClose: () => void;
  onAcceptSelected: (consent: CookieConsent) => void;
}

export function CookieSettings({ onClose, onAcceptSelected }: CookieSettingsProps) {
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === 'necessary') return; // No se puede desactivar

    setConsent((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onAcceptSelected(consent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuración de Cookies
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Personaliza qué tipos de cookies quieres permitir en tu navegación.
          </p>

          {/* Cookie necesarias */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Cookies Necesarias
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded">
                    Obligatorias
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Estas cookies son esenciales para el funcionamiento del sitio web y no se
                  pueden desactivar. Se utilizan para la gestión de sesiones, autenticación
                  y seguridad.
                </p>
              </div>
              <div className="ml-4 flex items-center">
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies de análisis */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cookies de Análisis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Nos permiten analizar el uso del sitio web y mejorar la experiencia del
                  visitante. Recopilan información anónima sobre las páginas visitadas y el
                  tiempo de navegación.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ejemplo: Google Analytics
                </p>
              </div>
              <div className="ml-4 flex items-center">
                <button
                  onClick={() => handleToggle('analytics')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    consent.analytics
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  } flex items-center ${
                    consent.analytics ? 'justify-end' : 'justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Cookies de marketing */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cookies de Marketing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Se utilizan para mostrar publicidad relevante y medir la efectividad de
                  las campañas publicitarias. Pueden ser establecidas por terceros.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ejemplo: Facebook Pixel, Google Ads
                </p>
              </div>
              <div className="ml-4 flex items-center">
                <button
                  onClick={() => handleToggle('marketing')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    consent.marketing
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  } flex items-center ${
                    consent.marketing ? 'justify-end' : 'justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Cookies de preferencias */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cookies de Preferencias
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Permiten que el sitio web recuerde tus preferencias (como idioma, tema
                  oscuro, etc.) para ofrecerte una experiencia más personalizada.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ejemplo: Idioma, tema, ubicación
                </p>
              </div>
              <div className="ml-4 flex items-center">
                <button
                  onClick={() => handleToggle('preferences')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    consent.preferences
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  } flex items-center ${
                    consent.preferences ? 'justify-end' : 'justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-300">
                <p className="font-medium mb-1">Información importante</p>
                <p>
                  Puedes cambiar tus preferencias en cualquier momento desde el pie de
                  página. Para más información, consulta nuestra Política de Cookies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  );
}
