'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import WebcamCard from '@/components/webcams/WebcamCard';

type Webcam = {
  id: string;
  name: string;
  location: string;
  url: string;
  type: 'image' | 'iframe';
  refresh_interval?: number | null;
  is_active: boolean;
  display_order: number;
};

export default function WebcamsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [webcams, setWebcams] = useState<Webcam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Cargar webcams desde la API
    loadWebcams();
  }, [user, authLoading, router]);

  const loadWebcams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/webcams');

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

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
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
            📷 Webcams de Viveiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cámaras en directo de diferentes ubicaciones de Viveiro
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-red-900 dark:text-red-300">
                  Error al cargar webcams
                </h3>
                <p className="text-sm text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info banner */}
        {!error && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Información sobre las webcams
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Las imágenes se actualizan automáticamente. Haz clic en el icono
                  de pantalla completa para ver la webcam en modo inmersivo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Webcams Grid */}
        {webcams.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              No hay webcams disponibles en este momento
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {webcams.map((webcam) => (
              <WebcamCard
                key={webcam.id}
                id={webcam.id}
                name={webcam.name}
                location={webcam.location}
                url={webcam.url}
                type={webcam.type}
                refreshInterval={webcam.refresh_interval || 30}
              />
            ))}
          </div>
        )}

        {/* Footer info */}
        {webcams.length > 0 && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-3xl">📷</div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Acerca de las webcams
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Las webcams proporcionan vistas en tiempo real de diferentes ubicaciones de Viveiro.
                  {webcams.length === 1 && ' Actualmente hay 1 webcam disponible.'}
                  {webcams.length > 1 && ` Actualmente hay ${webcams.length} webcams disponibles.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
