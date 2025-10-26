'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type SectionLink = {
  id: string;
  name: string;
  icon: string;
  path: string;
  enabled: boolean;
};

const sections: SectionLink[] = [
  {
    id: 'meteo',
    name: 'Meteorología',
    icon: '☁️',
    path: '/dashboard/meteo',
    enabled: true,
  },
  {
    id: 'eventos',
    name: 'Eventos',
    icon: '📅',
    path: '/dashboard/eventos',
    enabled: true,
  },
  {
    id: 'webcams',
    name: 'Webcams',
    icon: '📷',
    path: '/dashboard/webcams',
    enabled: true,
  },
  {
    id: 'seccion4',
    name: 'Sección 4',
    icon: '🔧',
    path: '/dashboard/seccion4',
    enabled: false,
  },
  {
    id: 'seccion5',
    name: 'Sección 5',
    icon: '📊',
    path: '/dashboard/seccion5',
    enabled: false,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              viveiro.live
            </span>
          </Link>

          {/* Botón cerrar en móvil */}
          <button
            onClick={closeSidebar}
            className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Cerrar menú"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {/* Home Pública */}
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="mr-3 text-xl">🌐</span>
            <span>Inicio</span>
          </Link>

          {/* Dashboard Home */}
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className={`
              flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
              ${
                pathname === '/dashboard'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="mr-3 text-xl">🏠</span>
            <span>Portal</span>
          </Link>

          {/* Divider */}
          <div className="my-3 border-t border-gray-200 dark:border-gray-800"></div>

          {/* Sections */}
          {sections.map((section) => {
            const isActive = pathname?.startsWith(section.path);

            if (!section.enabled) {
              return (
                <div
                  key={section.id}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 opacity-50 dark:text-gray-600"
                  title="Próximamente disponible"
                >
                  <span className="mr-3 text-xl">{section.icon}</span>
                  <span>{section.name}</span>
                  <span className="ml-auto text-xs">🔒</span>
                </div>
              );
            }

            return (
              <Link
                key={section.id}
                href={section.path}
                onClick={closeSidebar}
                className={`
                  flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="mr-3 text-xl">{section.icon}</span>
                <span>{section.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              {/* Botón hamburguesa (solo móvil) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label="Abrir menú"
              >
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logo en móvil */}
              <Link href="/dashboard" className="flex items-center space-x-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  viveiro.live
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Email del usuario en desktop */}
              <span className="hidden text-sm text-gray-600 dark:text-gray-400 lg:inline-block">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
