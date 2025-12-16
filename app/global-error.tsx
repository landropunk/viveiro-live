'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-9xl font-bold text-gray-900 dark:text-white">Error</h1>
            <h2 className="mb-8 text-3xl font-semibold text-gray-700 dark:text-gray-300">
              Algo salió mal
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {error.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              onClick={reset}
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
