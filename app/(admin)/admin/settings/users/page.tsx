'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserSetting {
  key: string;
  value: boolean | string;
  label: string;
  description: string;
}

export default function UserSettingsPage() {
  const [settings, setSettings] = useState<UserSetting[]>([]);
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

      const response = await fetch('/api/admin/user-settings');

      if (!response.ok) {
        throw new Error('Error al cargar configuración');
      }

      const data = await response.json();
      setSettings(data.settings || []);
    } catch (err) {
      console.error('Error cargando configuración:', err);
      setError('Error al cargar la configuración de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, newValue: boolean | string) => {
    try {
      setSaving(key);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/admin/user-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value: newValue }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar configuración');
      }

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

  const handleToggle = (key: string, currentValue: boolean) => {
    updateSetting(key, !currentValue);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">👥</div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando configuración de usuarios...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link
              href="/admin/settings"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Volver a Ajustes
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👥 Permisos de Usuarios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configura qué acciones pueden realizar los usuarios registrados
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

        {/* Settings Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          {/* Lista de ajustes */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {settings.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                {/* Info del ajuste */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {setting.description}
                  </p>
                </div>

                {/* Toggle Control */}
                <div className="ml-4">
                  {typeof setting.value === 'boolean' && (
                    <button
                      onClick={() => handleToggle(setting.key, setting.value)}
                      disabled={saving === setting.key}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${
                          saving === setting.key
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }
                        ${
                          setting.value
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }
                      `}
                      aria-label={`Toggle ${setting.label}`}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${setting.value ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">
            ℹ️ Información
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>Los cambios se aplican inmediatamente para todos los usuarios</li>
            <li>
              Si desactivas &quot;Editar perfil&quot;, los usuarios solo podrán ver su
              información
            </li>
            <li>
              El restablecimiento de contraseña siempre está disponible por seguridad
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
