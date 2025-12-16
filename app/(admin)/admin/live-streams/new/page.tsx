'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LiveStreamForm from '@/components/admin/LiveStreamForm';
import type { LiveStreamInput } from '@/types/live-stream';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

export default function NewStreamPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: LiveStreamInput) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log('📤 Enviando datos del stream:', data);

      const response = await fetch('/api/admin/live-streams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al crear stream');
      }

      console.log('✅ Stream creado:', result.data);

      // Redirigir a la lista de streams
      router.push('/admin/live-streams');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Error al crear stream');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nuevo Stream</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Agrega un nuevo vídeo en vivo o grabación
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <LiveStreamForm
            onSubmit={handleSubmit}
            submitLabel={submitting ? 'Creando...' : 'Crear Stream'}
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  );
}
