'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { LiveStream } from '@/types/live-stream';
import { PLATFORM_INFO, getEmbedUrl } from '@/types/live-stream';

// Force dynamic rendering for dashboard page
export const dynamic = 'force-dynamic';

export default function EventosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'recorded' | 'scheduled'>('all');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    loadStreams();
  }, [user, authLoading, router]);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading streams:', error);
        return;
      }

      setStreams(data || []);

      // Seleccionar el primer stream destacado o el primero de la lista
      const featured = data?.find((s) => s.is_featured);
      setSelectedStream(featured || data?.[0] || null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStreams = streams.filter((stream) => {
    if (filter === 'all') return true;
    return stream.stream_type === filter;
  });

  const getStatusBadge = (stream: LiveStream) => {
    const badges: Record<string, React.ReactElement> = {
      live: (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600"></span>
          En Vivo
        </span>
      ),
      recorded: (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          Grabado
        </span>
      ),
      scheduled: (
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
          Programado
        </span>
      ),
    };

    return badges[stream.stream_type] || null;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al portal
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            📺 Live / Play
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Eventos en directo, retransmisiones y contenido multimedia
          </p>
        </div>

        {streams.length === 0 ? (
          /* No hay streams */
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 text-6xl">📺</div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              No hay contenido disponible
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Actualmente no hay eventos en directo ni vídeos disponibles.
              <br />
              Vuelve pronto para ver nuevo contenido.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Video Player Principal */}
            <div className="lg:col-span-2">
              {selectedStream && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  {/* Video Embed */}
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-black">
                    <iframe
                      src={getEmbedUrl(selectedStream.video_id || '', selectedStream.platform, selectedStream.video_url)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Info del Video */}
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {getStatusBadge(selectedStream)}
                          {selectedStream.is_featured && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              ⭐ Destacado
                            </span>
                          )}
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedStream.title}
                        </h2>
                        {selectedStream.description && (
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedStream.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{PLATFORM_INFO[selectedStream.platform].icon}</span>
                        <span>{PLATFORM_INFO[selectedStream.platform].name}</span>
                      </div>
                      {selectedStream.category && (
                        <>
                          <span>•</span>
                          <span>{selectedStream.category}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{selectedStream.view_count} vistas</span>
                      {selectedStream.scheduled_start && (
                        <>
                          <span>•</span>
                          <span>📅 {formatDate(selectedStream.scheduled_start)}</span>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedStream.tags && selectedStream.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedStream.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Videos */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Más contenido
                  </h3>

                  {/* Filtros */}
                  <div className="mt-3 flex gap-2">
                    {(['all', 'live', 'recorded'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {f === 'all' ? 'Todos' : f === 'live' ? '● En Vivo' : 'Grabados'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  {filteredStreams.map((stream) => (
                    <button
                      key={stream.id}
                      onClick={() => setSelectedStream(stream)}
                      className={`w-full border-b border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                        selectedStream?.id === stream.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                          {stream.thumbnail_url ? (
                            <img
                              src={stream.thumbnail_url}
                              alt={stream.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl">
                              {PLATFORM_INFO[stream.platform].icon}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-1 flex items-center gap-2">
                            {getStatusBadge(stream)}
                          </div>
                          <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                            {stream.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {stream.view_count} vistas
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
