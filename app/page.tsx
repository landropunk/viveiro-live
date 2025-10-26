import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="z-10 w-full max-w-5xl">
          <div className="text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-100 p-6 dark:bg-blue-900/30">
              <svg
                className="h-20 w-20 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
              Meteorología Viveiro
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Accede a información meteorológica en tiempo real de Viveiro, Lugo.
              Datos precisos proporcionados por MeteoGalicia.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth/login"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
              >
                Registrarse
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Datos en Tiempo Real
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Temperatura, humedad, viento y precipitación actualizados cada 30 minutos
              </p>
            </div>

            <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Gráficos Interactivos
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualiza las tendencias meteorológicas con gráficos claros y detallados
              </p>
            </div>

            <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Acceso Seguro
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de autenticación robusto para proteger tu información
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
