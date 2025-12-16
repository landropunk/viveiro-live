'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LiveStreamForm from '@/components/admin/LiveStreamForm';
import type { LiveStream, LiveStreamInput } from '@/types/live-stream';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

export default function EditStreamPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStream();
  }, [id]);

  const loadStream = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/live-streams');
      const result = await response.json();

      if (!result.success) {
        throw new Error('Error al cargar streams');
      }

      const foundStream = result.data.find((s: LiveStream) => s.id === id);
      if (!foundStream) {
        throw new Error('Stream no encontrado');
      }

      setStream(foundStream);
    } catch (err) {
      setError('Error al cargar el stream');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: LiveStreamInput) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/admin/live-streams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...data,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar stream');
      }

      router.push('/admin/live-streams');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar stream');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando stream...</p>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">❌</div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Stream no encontrado</p>
          <Link
            href="/admin/live-streams"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Volver a streams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/live-streams"
          className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          ← Volver a streams
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Stream</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Modifica la información del stream
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <LiveStreamForm
            initialData={{
              title: stream.title,
              description: stream.description ?? undefined,
              platform: stream.platform,
              video_url: stream.video_url,
              stream_type: stream.stream_type,
              category: stream.category ?? undefined,
              tags: stream.tags,
              thumbnail_url: stream.thumbnail_url ?? undefined,
              is_active: stream.is_active,
              is_featured: stream.is_featured,
              scheduled_start: stream.scheduled_start ?? undefined,
              scheduled_end: stream.scheduled_end ?? undefined,
              display_order: stream.display_order,
            }}
            onSubmit={handleSubmit}
            submitLabel={submitting ? 'Guardando...' : 'Guardar Cambios'}
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  );
}
