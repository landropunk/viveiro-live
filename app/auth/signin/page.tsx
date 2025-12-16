'use client';

/**
// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

 * Página de inicio de sesión - Google OAuth + Email/Password
 * Next.js 15 + React 19
 */

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Bienvenido a Viveiro Live
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Accede al portal meteorológico de Viveiro
            </p>
          </div>

          {/* Formulario Email/Password */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          {/* Botón Google OAuth */}
          <button
            onClick={() => signInWithGoogle()}
            className="group flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-800"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Link a registro */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              ¿No tienes cuenta?{' '}
              <Link href="/auth/signup" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Info adicional */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Al continuar, aceptas nuestros{' '}
              <Link href="/about" className="text-blue-600 hover:underline dark:text-blue-400">
                términos de servicio
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
            <p>🔒 Tu privacidad es importante para nosotros</p>
          </div>
        </div>

        {/* Link volver */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
