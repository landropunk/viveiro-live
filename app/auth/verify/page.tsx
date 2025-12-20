'use client';

/**
 * Página de verificación de email con código OTP
 * Permite al usuario introducir el código de 6 dígitos enviado por email
 */

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar que el código tenga 6 dígitos
    if (!/^\d{6}$/.test(code)) {
      setError('El código debe tener 6 dígitos');
      setLoading(false);
      return;
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      setSuccess(true);

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Código inválido o expirado');
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                ¡Email verificado!
              </h1>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Tu cuenta ha sido confirmada correctamente. Redirigiendo al dashboard...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Verifica tu email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Introduce el código de 6 dígitos que hemos enviado a
            </p>
            <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">
              {email}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Código de verificación
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                required
                autoComplete="one-time-code"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-widest text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
                placeholder="000000"
                autoFocus
              />
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                El código expira en 60 minutos
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>

          {/* Info adicional */}
          <div className="mt-6 space-y-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              ¿No recibiste el código?{' '}
              <Link
                href="/auth/signup"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Reenviar código
              </Link>
            </p>

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                💡 También puedes verificar tu email haciendo clic en el enlace del correo
              </p>
            </div>
          </div>
        </div>

        {/* Link volver */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
