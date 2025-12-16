'use client';

import Link from 'next/link';

// Force dynamic rendering for 404 page
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-8 text-3xl font-semibold text-gray-700 dark:text-gray-300">
          Página no encontrada
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
