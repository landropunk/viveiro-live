'use client';

/**
 * Página de confirmación exitosa de email
 * Muestra mensaje de éxito y redirige automáticamente al completar perfil o dashboard
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir después de 3 segundos
    const timer = setTimeout(() => {
      // Forzar recarga completa para asegurar propagación de cookies
      window.location.href = '/complete-profile';
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
          <div className="text-center">
            {/* Icono de éxito animado */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <svg
                  className="h-16 w-16 text-green-600 dark:text-green-400 animate-bounce"
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

            {/* Título */}
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              ¡Email verificado!
            </h1>

            {/* Mensaje */}
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Tu cuenta ha sido confirmada exitosamente
            </p>

            {/* Indicador de progreso */}
            <div className="mb-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-emerald-600 animate-progress"
                  style={{
                    animation: 'progress 3s linear forwards',
                  }}
                />
              </div>
            </div>

            {/* Texto de redirección */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirigiendo en unos segundos...
            </p>
          </div>
        </div>

        {/* Botón manual por si no redirige automáticamente */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/complete-profile'}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Continuar manualmente →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          width: 0%;
        }
      `}</style>
    </main>
  );
}
