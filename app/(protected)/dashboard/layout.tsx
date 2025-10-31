'use client';

import { ReactNode, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

type SectionLink = {
  id: string;
  name: string;
  icon: string | ReactNode;
  path: string;
  enabled: boolean;
};

// Icono Live/Play SVG profesional - Estilo moderno con play button y ondas
const LiveIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Botón Play central */}
    <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.2" />
    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />

    {/* Ondas de transmisión */}
    <path
      d="M2 12a10 10 0 0 1 2.93-7.07M22 12a10 10 0 0 0-2.93-7.07M2 12a10 10 0 0 0 2.93 7.07M22 12a10 10 0 0 1-2.93 7.07"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

// Definición base de secciones (estructura fija)
const baseSections: SectionLink[] = [
  {
    id: 'meteo',
    name: 'Meteorología',
    icon: '☁️',
    path: '/dashboard/meteo',
    enabled: true, // Por defecto, se sobrescribe con configuración
  },
  {
    id: 'historicos',
    name: 'Históricos Horarios',
    icon: '📊',
    path: '/dashboard/historicos',
    enabled: false,
  },
  {
    id: 'live',
    name: 'Live / Play',
    icon: <LiveIcon className="h-5 w-5" />,
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
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { config, loading: configLoading } = useDashboardConfig();

  // Aplicar configuración dinámica a las secciones
  const sections = useMemo(() => {
    return baseSections.map((section) => ({
      ...section,
      enabled: config[section.id as keyof typeof config] ?? section.enabled,
    }));
  }, [config]);

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
          <Link href="/dashboard" className="flex items-center gap-3" onClick={closeSidebar}>
            {/* Escudo con bandera circular */}
            <div
              style={{
                width: "40px",
                height: "40px",
                position: "relative",
                flexShrink: 0
              }}
            >
              {/* Bandera como fondo circular */}
              <img
                src="/banderaViveiro.jpg"
                alt="Bandera de Viveiro"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
              {/* Escudo encima centrado */}
              <img
                src="/Escudo_de_Viveiro.png"
                alt="Escudo de Viveiro"
                style={{
                  width: "auto",
                  height: "33px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "block",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
                }}
              />
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

          {/* Mi Espacio Home */}
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
            <span>Mi Espacio</span>
          </Link>

          {/* Admin Access */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeSidebar}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-red-50 text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <span className="mr-3 text-xl">⚙️</span>
              <span>Panel Admin</span>
            </Link>
          )}

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
                  <span className={typeof section.icon === 'string' ? 'mr-3 text-xl' : 'mr-3'}>
                    {section.icon}
                  </span>
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
                <span className={typeof section.icon === 'string' ? 'mr-3 text-xl' : 'mr-3'}>
                  {section.icon}
                </span>
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
              <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
                {/* Escudo con bandera circular */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "relative",
                    flexShrink: 0
                  }}
                >
                  {/* Bandera como fondo circular */}
                  <img
                    src="/banderaViveiro.jpg"
                    alt="Bandera de Viveiro"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                  {/* Escudo encima centrado */}
                  <img
                    src="/Escudo_de_Viveiro.png"
                    alt="Escudo de Viveiro"
                    style={{
                      width: "auto",
                      height: "33px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "block",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
                    }}
                  />
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
