'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';

type Webcam = {
  id: string;
  name: string;
  location: string;
  url: string;
  type: 'image' | 'iframe';
  refresh_interval: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export default function AdminWebcamsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [webcams, setWebcams] = useState<Webcam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWebcam, setEditingWebcam] = useState<Webcam | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    url: '',
    type: 'image' as 'image' | 'iframe',
    refresh_interval: 30,
    display_order: 0,
  });

  // Redirect si no es admin
  useEffect(() => {
    if (authLoading || adminLoading) return; // Esperar a que termine de verificar admin
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!isAdmin) {
      console.log('[AdminWebcamsPage] Usuario no es admin, redirigiendo a /dashboard');
      router.push('/dashboard');
      return;
    }
  }, [user, isAdmin, authLoading, adminLoading, router]);

  // Cargar webcams
  useEffect(() => {
    if (!isAdmin) return;
    loadWebcams();
  }, [isAdmin]);

  const loadWebcams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/webcams');

      if (!response.ok) {
        throw new Error('Error al cargar webcams');
      }

      const data = await response.json();
      setWebcams(data.webcams || []);
    } catch (err) {
      console.error('Error loading webcams:', err);
      setError('Error al cargar las webcams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingWebcam ? 'PATCH' : 'POST';
      const body = editingWebcam
        ? { id: editingWebcam.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/webcams', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al guardar webcam');
      }

      // Recargar lista
      await loadWebcams();

      // Limpiar formulario
      setShowForm(false);
      setEditingWebcam(null);
      setFormData({
        name: '',
        location: '',
        url: '',
        type: 'image',
        refresh_interval: 30,
        display_order: 0,
      });
    } catch (err) {
      console.error('Error saving webcam:', err);
      alert('Error al guardar la webcam');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (webcam: Webcam) => {
    setEditingWebcam(webcam);
    setFormData({
      name: webcam.name,
      location: webcam.location,
      url: webcam.url,
      type: webcam.type,
      refresh_interval: webcam.refresh_interval || 30,
      display_order: webcam.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta webcam?')) return;

    try {
      const response = await fetch(`/api/admin/webcams?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar webcam');
      }

      await loadWebcams();
    } catch (err) {
      console.error('Error deleting webcam:', err);
      alert('Error al eliminar la webcam');
    }
  };

  const handleToggleActive = async (webcam: Webcam) => {
    try {
      const response = await fetch('/api/admin/webcams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: webcam.id,
          is_active: !webcam.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar webcam');
      }

      await loadWebcams();
    } catch (err) {
      console.error('Error toggling webcam:', err);
      alert('Error al actualizar el estado de la webcam');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingWebcam(null);
    setFormData({
      name: '',
      location: '',
      url: '',
      type: 'image',
      refresh_interval: 30,
      display_order: 0,
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📹 Gestión de Webcams
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Administra las webcams públicas de Viveiro
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            + Nueva Webcam
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {editingWebcam ? 'Editar Webcam' : 'Nueva Webcam'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Penedo do Galo"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: MeteoGalicia - Viveiro"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="https://..."
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'image' | 'iframe',
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="image">Imagen (actualización periódica)</option>
                    <option value="iframe">iframe (stream continuo)</option>
                  </select>
                </div>

                {/* Intervalo de actualización (solo para imágenes) */}
                {formData.type === 'image' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Intervalo de actualización (segundos)
                    </label>
                    <input
                      type="number"
                      value={formData.refresh_interval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          refresh_interval: parseInt(e.target.value),
                        })
                      }
                      min="5"
                      max="300"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                {/* Orden de visualización */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Orden de visualización
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Menor número = mayor prioridad
                  </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelForm}
                    disabled={saving}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Webcams List */}
        <div className="space-y-4">
          {webcams.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No hay webcams configuradas
              </p>
            </div>
          ) : (
            webcams.map((webcam) => (
              <div
                key={webcam.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {webcam.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          webcam.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {webcam.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {webcam.type === 'image' ? 'Imagen' : 'Stream'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {webcam.location}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {webcam.url}
                    </p>
                    {webcam.type === 'image' && webcam.refresh_interval && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Actualiza cada {webcam.refresh_interval}s
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      Orden: {webcam.display_order}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(webcam)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        webcam.is_active
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {webcam.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleEdit(webcam)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(webcam.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
