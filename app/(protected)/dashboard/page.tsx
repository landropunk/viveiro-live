'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

type SectionType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  enabled: boolean;
};

const sections: SectionType[] = [
  {
    id: 'meteo',
    name: 'Meteorología',
    description: 'Datos meteorológicos en tiempo real de Viveiro con históricos y pronósticos',
    icon: '☁️',
    path: '/dashboard/meteo',
    enabled: true,
  },
  {
    id: 'eventos',
    name: 'Eventos en Directo',
    description: 'Calendario de eventos municipales y streaming en vivo',
    icon: '📅',
    path: '/dashboard/eventos',
    enabled: true,
  },
  {
    id: 'webcams',
    name: 'Webcams',
    description: 'Cámaras en directo de diferentes ubicaciones de Viveiro',
    icon: '📷',
    path: '/dashboard/webcams',
    enabled: true,
  },
  {
    id: 'seccion4',
    name: 'Sección 4',
    description: 'Próximamente disponible',
    icon: '🔧',
    path: '/dashboard/seccion4',
    enabled: false,
  },
  {
    id: 'seccion5',
    name: 'Sección 5',
    description: 'Próximamente disponible',
    icon: '📊',
    path: '/dashboard/seccion5',
    enabled: false,
  },
];

export default function DashboardPage() {
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
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Portal Municipal de Viveiro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bienvenido/a, {user.email}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Selecciona una sección para comenzar
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.id}>
              {section.enabled ? (
                <Link href={section.path}>
                  <div className="group relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400">
                    {/* Icon */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-4xl transition-colors group-hover:bg-blue-100 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
                      {section.icon}
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {section.name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-6 right-6 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="h-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 p-6 opacity-60 dark:border-gray-700 dark:bg-gray-800/50">
                  {/* Icon */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl dark:bg-gray-700">
                    {section.icon}
                  </div>

                  {/* Title */}
                  <h2 className="mb-2 text-xl font-semibold text-gray-500 dark:text-gray-400">
                    {section.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {section.description}
                  </p>

                  {/* Coming soon badge */}
                  <div className="mt-4 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    Próximamente
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">ℹ️</div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Información del Portal
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Este portal municipal ofrece acceso a diferentes servicios y secciones para los ciudadanos de Viveiro.
                Todas las secciones están disponibles con tu cuenta registrada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
