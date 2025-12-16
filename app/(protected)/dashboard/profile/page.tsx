'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  birth_date: string;
  bio: string;
  avatar_url: string;
  role: string;
  is_active: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [showPostalCode, setShowPostalCode] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: 'Viveiro',
    postal_code: '',
    birth_date: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
    checkPermissions();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        throw new Error('Error al cargar el perfil');
      }

      const data = await response.json();
      setProfile(data.profile);

      // Llenar el formulario
      setFormData({
        full_name: data.profile.full_name || '',
        phone: data.profile.phone || '',
        address: data.profile.address || '',
        city: data.profile.city || 'Viveiro',
        postal_code: data.profile.postal_code || '',
        birth_date: data.profile.birth_date || '',
        bio: data.profile.bio || '',
        avatar_url: data.profile.avatar_url || '',
      });

      setShowPostalCode(data.profile.city !== 'Viveiro');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const response = await fetch('/api/user/permissions');
      if (response.ok) {
        const data = await response.json();
        setCanEdit(data.canEditProfile);
      }
    } catch (err) {
      console.error('Error verificando permisos:', err);
    }
  };

  const handleCityChange = (city: string) => {
    setFormData({ ...formData, city });
    setShowPostalCode(city !== 'Viveiro');

    if (city === 'Viveiro') {
      setFormData({ ...formData, city, postal_code: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }

      setSuccessMessage('Perfil actualizado correctamente');
      setProfile(data.profile);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">👤</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👤 Mi Perfil
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {canEdit
              ? 'Gestiona tu información personal'
              : 'Visualiza tu información personal (edición deshabilitada por el administrador)'}
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

        {!canEdit && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/10">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ La edición de perfiles está deshabilitada por el administrador
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Información Básica
            </h2>

            <div className="space-y-4">
              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  El email no se puede modificar
                </p>
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!canEdit}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <input
                  type="tel"
                  disabled={!canEdit}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ej: 982 123 456"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>

              {/* Biografía */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Biografía
                </label>
                <textarea
                  disabled={!canEdit}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Cuéntanos algo sobre ti..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Ubicación
            </h2>

            <div className="space-y-4">
              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, número, piso..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={!canEdit}
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                >
                  <option value="Viveiro">Viveiro</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Código Postal (condicional) */}
              {showPostalCode && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="Ej: 27850"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Información Adicional
            </h2>

            <div className="space-y-4">
              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  disabled={!canEdit}
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Avatar URL
                </label>
                <input
                  type="url"
                  disabled={!canEdit}
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          {canEdit && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={loadProfile}
                disabled={saving}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </form>

        {/* Info sobre cuenta */}
        {profile && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Información de la Cuenta
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">Rol:</span>{' '}
                {profile.role === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{' '}
                {profile.is_active ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
