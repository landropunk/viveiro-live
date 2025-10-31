'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    // Filtro por rol
    if (filterRole !== 'all' && user.role !== filterRole) return false;

    // Filtro por estado
    if (filterStatus === 'active' && !user.is_active) return false;
    if (filterStatus === 'inactive' && user.is_active) return false;

    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchEmail = user.email.toLowerCase().includes(query);
      const matchName = user.full_name?.toLowerCase().includes(query);
      if (!matchEmail && !matchName) return false;
    }

    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">👥</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👥 Gestión de Usuarios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Usuarios</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-600 dark:text-gray-400">Usuarios Activos</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-600 dark:text-gray-400">Administradores</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.admins}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Email o nombre..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="user">Usuarios</option>
                <option value="admin">Administradores</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Fecha Registro
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.full_name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron usuarios
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
