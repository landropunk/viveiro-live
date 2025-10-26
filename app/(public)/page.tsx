import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="z-10 w-full max-w-6xl">
          <div className="text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-100 p-8 dark:bg-blue-900/30">
              <svg
                className="h-24 w-24 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
              viveiro.live
            </h1>
            <p className="mx-auto mb-3 max-w-3xl text-2xl font-semibold text-gray-900 dark:text-white">
              Portal Municipal de Viveiro
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Accede a información municipal, meteorología en tiempo real, eventos en directo,
              webcams y más servicios para los ciudadanos de Viveiro (Lugo, España).
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth/login"
                className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
              >
                Registrarse
              </Link>
            </div>
          </div>

          {/* Sections Preview */}
          <div className="mt-20">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Secciones del Portal
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Meteorología */}
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 text-5xl">☁️</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Meteorología
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Datos meteorológicos en tiempo real de las estaciones de Viveiro, con históricos
                  de hasta 72 horas y pronósticos detallados.
                </p>
              </div>

              {/* Eventos */}
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 text-5xl">📅</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Eventos en Directo
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Calendario de eventos municipales con streaming en vivo e información
                  detallada de cada evento.
                </p>
              </div>

              {/* Webcams */}
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 text-5xl">📷</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Webcams
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualización en directo de cámaras en diferentes ubicaciones de Viveiro
                  con vista en cuadrícula y pantalla completa.
                </p>
              </div>

              {/* Más secciones */}
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-orange-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 text-5xl">🔧</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Y más servicios
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Próximamente más secciones y servicios para los ciudadanos de Viveiro.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Características
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Datos en Tiempo Real
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Información actualizada constantemente de MeteoGalicia y otras fuentes oficiales.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Diseño Responsive
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accede desde cualquier dispositivo: móvil, tablet o escritorio.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
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
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Acceso Seguro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de autenticación OAuth con Google, Microsoft y Facebook.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="mt-20 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-12 text-center dark:border-gray-800 dark:from-blue-900/20 dark:to-cyan-900/20">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              ¿Listo para comenzar?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Regístrate ahora y accede a todas las secciones del portal municipal de Viveiro.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
