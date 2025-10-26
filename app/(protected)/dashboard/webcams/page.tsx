'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function WebcamsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
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
            📷 Webcams de Viveiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cámaras en directo de diferentes ubicaciones de Viveiro
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-6xl dark:bg-blue-900/30">
            📷
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Próximamente disponible
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Esta sección estará disponible próximamente. Aquí podrás ver cámaras en directo de diferentes
            ubicaciones de Viveiro, con vista en cuadrícula y modo pantalla completa.
          </p>

          {/* Features Preview */}
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Características planificadas
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <div className="mb-2 text-2xl">🎥</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Múltiples cámaras
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <div className="mb-2 text-2xl">🔲</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Vista en cuadrícula
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <div className="mb-2 text-2xl">⛶</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Pantalla completa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
