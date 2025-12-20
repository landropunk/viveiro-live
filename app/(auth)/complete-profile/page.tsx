'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    city: 'Viveiro',
    postal_code: '',
    birth_year: '',
  });

  const [showPostalCode, setShowPostalCode] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  const handleCityChange = (city: string) => {
    setFormData({ ...formData, city });
    setShowPostalCode(city !== 'Viveiro');

    // Si vuelve a Viveiro, limpiar código postal
    if (city === 'Viveiro') {
      setFormData({ ...formData, city, postal_code: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.full_name.trim()) {
      setError('El nombre completo es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.birth_year) {
      setError('El año de nacimiento es obligatorio');
      setLoading(false);
      return;
    }

    // Validar que sea un año válido
    const yearNum = parseInt(formData.birth_year);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      setError('Por favor, introduce un año de nacimiento válido');
      setLoading(false);
      return;
    }

    // Validar edad mínima de 12 años
    const age = currentYear - yearNum;
    if (age < 12) {
      setError('Debes tener al menos 12 años para registrarte en esta aplicación');
      setLoading(false);
      return;
    }

    if (formData.city !== 'Viveiro' && !formData.postal_code.trim()) {
      setError('El código postal es obligatorio si no eres de Viveiro');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Enviando datos:', formData);

      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al completar el perfil');
      }

      // Forzar recarga completa para propagación de cookies
      console.log('✅ Perfil completado, redirigiendo...');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('❌ Error al completar perfil:', err);
      setError(err instanceof Error ? err.message : 'Error al completar el perfil');
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Completa tu perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Necesitamos algunos datos adicionales para continuar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email (readonly) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              />
            </div>

            {/* Nombre completo */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="Viveiro">Viveiro</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Año de nacimiento */}
            <div>
              <label htmlFor="birth_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Año de nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                id="birth_year"
                name="birth_year"
                type="number"
                required
                min="1900"
                max={new Date().getFullYear()}
                value={formData.birth_year}
                onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Ej: 1990"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Debes tener al menos 12 años para registrarte
              </p>
            </div>

            {/* Código Postal (condicional) */}
            {showPostalCode && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código Postal <span className="text-red-500">*</span>
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  required={showPostalCode}
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                  placeholder="Ej: 27850"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {loading ? 'Guardando...' : 'Completar perfil'}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Los campos marcados con <span className="text-red-500">*</span> son obligatorios
          </p>
        </form>
      </div>
    </div>
  );
}
