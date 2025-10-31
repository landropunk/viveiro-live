'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AppSetting {
  id: string;
  key: string;
  value: any;
  category: 'sections' | 'features' | 'general';
  label: string;
  description?: string;
  updated_at: string;
  locked?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/settings');

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Error al cargar configuración');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('Error cargando configuración:', err);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, newValue: any) => {
    try {
      setSaving(key);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value: newValue }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar configuración');
      }

      const result = await response.json();

      // Actualizar el estado local
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value: newValue } : s))
      );

      setSuccessMessage('Configuración actualizada correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error actualizando configuración:', err);
      setError('Error al actualizar la configuración');
    } finally {
      setSaving(null);
    }
  };

  const handleToggle = (setting: AppSetting) => {
    const currentValue = setting.value?.enabled ?? false;
    updateSetting(setting.key, { enabled: !currentValue });
  };

  const handleValueChange = (setting: AppSetting, newValue: string | number) => {
    updateSetting(setting.key, { value: newValue });
  };

  // Orden deseado de las secciones
  const sectionOrder = [
    'section_meteo',
    'section_historicos',
    'section_live',
    'section_webcams',
    'section_seccion5',
    'section_seccion6',
  ];

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, AppSetting[]>);

  // Ordenar las secciones según el orden definido
  if (groupedSettings.sections) {
    groupedSettings.sections.sort((a, b) => {
      const indexA = sectionOrder.indexOf(a.key);
      const indexB = sectionOrder.indexOf(b.key);
      // Si no está en el array, ponerlo al final
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  const categoryLabels = {
    sections: 'Secciones del Dashboard',
    features: 'Características',
    general: 'Configuración General',
  };

  const categoryIcons = {
    sections: '📱',
    features: '✨',
    general: '⚙️',
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚙️</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⚙️ Ajustes de la Aplicación
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configura las secciones y características de la aplicación web
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/10">
            <p className="text-green-800 dark:text-green-200">✅ {successMessage}</p>
          </div>
        )}

        {/* Categorías de configuración */}
        <div className="space-y-6">
          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <div
              key={category}
              className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              {/* Header de categoría */}
              <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                  <span className="mr-2 text-2xl">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h2>
              </div>

              {/* Lista de ajustes */}
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {categorySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    {/* Info del ajuste */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {setting.label}
                        </h3>
                        {setting.locked && (
                          <span
                            className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            title="Esta función requiere activación en el código"
                          >
                            🔒 Bloqueado
                          </span>
                        )}
                      </div>
                      {setting.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {setting.description}
                        </p>
                      )}
                      {setting.locked && (
                        <p className="mt-1 text-xs italic text-yellow-600 dark:text-yellow-500">
                          ⚠️ Esta característica requiere cambios en el código para activarse
                        </p>
                      )}
                    </div>

                    {/* Control */}
                    <div className="ml-4">
                      {/* Toggle switch para enabled */}
                      {setting.value?.hasOwnProperty('enabled') && (
                        <button
                          onClick={() => handleToggle(setting)}
                          disabled={saving === setting.key || setting.locked}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${
                              saving === setting.key || setting.locked
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                            }
                            ${
                              setting.value.enabled
                                ? 'bg-blue-600'
                                : 'bg-gray-300 dark:bg-gray-700'
                            }
                          `}
                          aria-label={`Toggle ${setting.label}`}
                          title={setting.locked ? 'Esta función está bloqueada en el código' : undefined}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                              ${setting.value.enabled ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                          {setting.locked && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs">
                              🔒
                            </span>
                          )}
                        </button>
                      )}

                      {/* Input para valores numéricos */}
                      {setting.value?.hasOwnProperty('value') &&
                        typeof setting.value.value === 'number' && (
                          <div className="relative">
                            <input
                              type="number"
                              value={setting.value.value}
                              onChange={(e) =>
                                handleValueChange(setting, parseInt(e.target.value, 10))
                              }
                              disabled={saving === setting.key || setting.locked}
                              className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-1 text-center text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                            {setting.locked && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                                🔒
                              </span>
                            )}
                          </div>
                        )}

                      {/* Input para valores de texto */}
                      {setting.value?.hasOwnProperty('value') &&
                        typeof setting.value.value === 'string' && (
                          <div className="relative">
                            <input
                              type="text"
                              value={setting.value.value}
                              onChange={(e) => handleValueChange(setting, e.target.value)}
                              disabled={saving === setting.key || setting.locked}
                              className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-1 pr-8 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                              title={setting.locked ? 'Esta función está bloqueada en el código' : undefined}
                            />
                            {setting.locked && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                                🔒
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">
            ℹ️ Información
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>Los cambios se aplican inmediatamente</li>
            <li>Las secciones desactivadas no aparecerán en el menú del dashboard</li>
            <li>
              Algunas funciones pueden requerir configuración adicional (ej: Históricos
              requiere API de MeteoGalicia)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
