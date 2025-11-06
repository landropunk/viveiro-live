'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type AdminCard = {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
};

type Stats = {
  publishedPosts: number;
  activeWebcams: number;
  liveStreams: number;
  totalUsers: number;
};

const adminCards: AdminCard[] = [
  {
    title: 'Ajustes de la Aplicación',
    description: 'Configura secciones, características y opciones generales',
    icon: '⚙️',
    href: '/admin/settings',
    color: 'from-gray-500 to-slate-500',
  },
  {
    title: 'Blog / Noticias',
    description: 'Gestiona artículos y noticias para la página de inicio',
    icon: '📝',
    href: '/admin/blog',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Webcams',
    description: 'Administra las cámaras web en directo de Viveiro',
    icon: '📷',
    href: '/admin/webcams',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Live / Play',
    description: 'Gestiona vídeos y transmisiones en directo de YouTube',
    icon: '📺',
    href: '/admin/live-streams',
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Usuarios',
    description: 'Administra usuarios y permisos del sistema',
    icon: '👥',
    href: '/admin/users',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    publishedPosts: 0,
    activeWebcams: 0,
    liveStreams: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();

      // Cargar posts publicados
      const { count: postsCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Cargar webcams activas
      const { count: webcamsCount } = await supabase
        .from('webcams')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Cargar streams activos
      const { count: streamsCount } = await supabase
        .from('live_streams')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Cargar total de usuarios
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        publishedPosts: postsCount || 0,
        activeWebcams: webcamsCount || 0,
        liveStreams: streamsCount || 0,
        totalUsers: usersCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bienvenido, {user?.email}. Gestiona todos los aspectos de viveiro.live desde aquí.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Posts Publicados
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.publishedPosts}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Webcams Activas
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.activeWebcams}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <span className="text-2xl">📷</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Contenido Live/Play
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.liveStreams}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <span className="text-2xl">📺</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuarios Totales
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalUsers}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Acceso Rápido
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-5`}
              />
              <div className="relative">
                <div className="mb-4 text-4xl">{card.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 text-gray-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
