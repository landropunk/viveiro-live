'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
import Link from 'next/link';

type SectionType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  enabled: boolean;
};

// Definición base de secciones (se sobrescribe con configuración dinámica)
const baseSections: SectionType[] = [
  {
    id: 'meteo',
    name: 'Meteorología',
    description: 'Datos meteorológicos en tiempo real de Viveiro con históricos y pronósticos',
    icon: '☁️',
    path: '/dashboard/meteo',
    enabled: true,
  },
  {
    id: 'historicos',
    name: 'Históricos Horarios',
    description: 'Consulta datos históricos de las últimas horas con gráficos interactivos',
    icon: '📊',
    path: '/dashboard/historicos',
    enabled: false,
  },
  {
    id: 'live',
    name: 'Live / Play',
    description: 'Eventos en directo, retransmisiones y contenido multimedia',
    icon: '🔴',
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
    id: 'seccion5',
    name: 'Sección 5',
    description: 'Sección adicional personalizable - Próximamente disponible',
    icon: '🔧',
    path: '/dashboard/seccion5',
    enabled: false,
  },
  {
    id: 'seccion6',
    name: 'Sección 6',
    description: 'Sección adicional personalizable - Próximamente disponible',
    icon: '📋',
    path: '/dashboard/seccion6',
    enabled: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const { config, loading: configLoading } = useDashboardConfig();

  // Aplicar configuración dinámica a las secciones
  const sections = useMemo(() => {
    return baseSections.map((section) => ({
      ...section,
      enabled: config[section.id as keyof typeof config] ?? section.enabled,
    }));
  }, [config]);

  // Filtrar secciones según el rol del usuario
  const visibleSections = useMemo(() => {
    if (isAdmin) {
      // Administradores ven todas las secciones
      return sections;
    } else {
      // Usuarios normales solo ven secciones habilitadas
      return sections.filter(s => s.enabled);
    }
  }, [sections, isAdmin]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading || configLoading) {
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
            Mi Espacio
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
          {visibleSections.map((section) => {
            const isDisabled = !section.enabled;

            // Si está deshabilitada y el usuario es admin, mostrar con candado
            if (isDisabled && isAdmin) {
              return (
                <div
                  key={section.id}
                  className="relative h-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100 p-6 opacity-50 dark:border-gray-600 dark:bg-gray-700/50"
                >
                  {/* Candado en esquina superior derecha */}
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-4xl dark:bg-gray-600">
                    {section.icon}
                  </div>

                  {/* Title */}
                  <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">
                    {section.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {section.description}
                  </p>

                  {/* Badge de deshabilitado */}
                  <div className="mt-4 inline-block rounded-full bg-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                    Deshabilitado
                  </div>
                </div>
              );
            }

            // Sección habilitada (normal)
            return (
              <Link key={section.id} href={section.path}>
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
            );
          })}
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
                {isAdmin && (
                  <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                    Como administrador, puedes ver todas las secciones (las deshabilitadas aparecen con candado).
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
