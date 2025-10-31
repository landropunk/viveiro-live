'use client';

import { useRouter } from 'next/navigation';

export default function Seccion6Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Sección 6
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Esta sección está preparada para ser personalizada según tus necesidades
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                🎨 Personaliza esta sección
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Puedes modificar el archivo <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">app/(protected)/dashboard/seccion6/page.tsx</code> para agregar el contenido que necesites.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                💡 Ideas de uso:
              </h3>
              <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
                <li>Galería de fotos y vídeos de Viveiro</li>
                <li>Registro de actividades turísticas</li>
                <li>Sistema de encuestas ciudadanas</li>
                <li>Marketplace de productos locales</li>
                <li>Cualquier otra funcionalidad personalizada</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
                <span>ℹ️</span>
                <span>Activación</span>
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Para activar esta sección, ve a <strong>/admin/settings</strong> y desbloquea "Sección 6" modificando su estado <code>locked</code> en la base de datos.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
              >
                ← Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
