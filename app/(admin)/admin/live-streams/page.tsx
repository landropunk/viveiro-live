'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LiveStream } from '@/types/live-stream';
import { PLATFORM_INFO } from '@/types/live-stream';

// Force dynamic rendering for admin page
export const dynamic = 'force-dynamic';

export default function LiveStreamsAdminPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'recorded' | 'scheduled'>('all');

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/live-streams');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al cargar streams');
      }

      setStreams(result.data);
    } catch (err) {
      setError('Error al cargar los streams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/live-streams?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar');
      }

      // Recargar la lista
      loadStreams();
    } catch (err) {
      alert('Error al eliminar el stream');
      console.error(err);
    }
  };

  const toggleActive = async (stream: LiveStream) => {
    try {
      const response = await fetch('/api/admin/live-streams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stream.id,
          is_active: !stream.is_active,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar');
      }

      loadStreams();
    } catch (err) {
      alert('Error al actualizar el stream');
      console.error(err);
    }
  };

  const toggleFeatured = async (stream: LiveStream) => {
    try {
      const response = await fetch('/api/admin/live-streams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stream.id,
          is_featured: !stream.is_featured,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar');
      }

      loadStreams();
    } catch (err) {
      alert('Error al actualizar el stream');
      console.error(err);
    }
  };

  const filteredStreams = streams.filter((stream) => {
    if (filter === 'all') return true;
    return stream.stream_type === filter;
  });

  const getStatusBadge = (stream: LiveStream) => {
    if (!stream.is_active) {
      return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">Inactivo</span>;
    }

    const badges: Record<string, React.ReactElement> = {
      live: <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-400">● En Vivo</span>,
      recorded: <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Grabado</span>,
      scheduled: <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Programado</span>,
    };

    return badges[stream.stream_type] || null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              ← Volver al panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Live / Play
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Administra los vídeos en vivo y grabaciones
            </p>
          </div>
          <Link
            href="/admin/live-streams/new"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            + Nuevo Stream
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6 flex gap-2">
          {(['all', 'live', 'recorded', 'scheduled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'live' ? 'En Vivo' : f === 'recorded' ? 'Grabados' : 'Programados'}
            </button>
          ))}
        </div>

        {/* Lista de streams */}
        {filteredStreams.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 text-6xl">📺</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No hay streams
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Comienza creando tu primer stream en vivo o grabación
            </p>
            <Link
              href="/admin/live-streams/new"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Crear primer stream
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStreams.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
              >
                {/* Thumbnail */}
                <div className="h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {stream.thumbnail_url ? (
                    <img
                      src={stream.thumbnail_url}
                      alt={stream.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      {PLATFORM_INFO[stream.platform].icon}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stream.title}
                    </h3>
                    {getStatusBadge(stream)}
                    {stream.is_featured && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        ⭐ Destacado
                      </span>
                    )}
                  </div>
                  <div className="mb-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{PLATFORM_INFO[stream.platform].name}</span>
                    {stream.category && (
                      <>
                        <span>•</span>
                        <span>{stream.category}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{stream.view_count} vistas</span>
                  </div>
                  {stream.description && (
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {stream.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => toggleActive(stream)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      stream.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                    title={stream.is_active ? 'Desactivar' : 'Activar'}
                  >
                    {stream.is_active ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={() => toggleFeatured(stream)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      stream.is_featured
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                    title={stream.is_featured ? 'Quitar destacado' : 'Destacar'}
                  >
                    ⭐
                  </button>
                  <Link
                    href={`/admin/live-streams/edit/${stream.id}`}
                    className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(stream.id, stream.title)}
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
