'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';

type AdminLink = {
  id: string;
  name: string;
  icon: string;
  path: string;
};

const adminLinks: AdminLink[] = [
  {
    id: 'dashboard',
    name: 'Panel Principal',
    icon: '📊',
    path: '/admin',
  },
  {
    id: 'blog',
    name: 'Blog / Noticias',
    icon: '📝',
    path: '/admin/blog',
  },
  {
    id: 'webcams',
    name: 'Webcams',
    icon: '📷',
    path: '/admin/webcams',
  },
  {
    id: 'live-streams',
    name: 'Live / Play',
    icon: '📺',
    path: '/admin/live-streams',
  },
  {
    id: 'users',
    name: 'Usuarios',
    icon: '👥',
    path: '/admin/users',
  },
  {
    id: 'settings',
    name: 'Ajustes',
    icon: '⚙️',
    path: '/admin/settings',
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
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
          <Link href="/admin" className="flex items-center gap-3" onClick={closeSidebar}>
            <div
              style={{
                width: "40px",
                height: "40px",
                position: "relative",
                flexShrink: 0
              }}
            >
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
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                viveiro.live
              </span>
              <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                ADMIN
              </span>
            </div>
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
          {/* Links de regreso */}
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="mr-3 text-xl">🌐</span>
            <span>Inicio Público</span>
          </Link>

          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="mr-3 text-xl">🏠</span>
            <span>Mi Espacio</span>
          </Link>

          {/* Divider */}
          <div className="my-3 border-t border-gray-200 dark:border-gray-800"></div>

          {/* Admin Sections */}
          {adminLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/admin' && pathname?.startsWith(link.path));

            return (
              <Link
                key={link.id}
                href={link.path}
                onClick={closeSidebar}
                className={`
                  flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="mr-3 text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Administrador
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
              <Link href="/admin" className="flex items-center gap-3 lg:hidden">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "relative",
                    flexShrink: 0
                  }}
                >
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
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    viveiro.live
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    ADMIN
                  </span>
                </div>
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
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
