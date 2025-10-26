import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Acerca de - Next.js Autonomía",
  description: "Conoce más sobre el proyecto Next.js Autonomía y sus tecnologías",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-16 dark:from-gray-950 dark:to-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
              Acerca del Proyecto
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Next.js Autonomía es un proyecto base configurado con las mejores
              prácticas y herramientas modernas para desarrollo web.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Nuestra Misión
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Proporcionar una base sólida y bien estructurada para desarrollar
              aplicaciones web modernas con Next.js 14, TypeScript y las mejores
              herramientas del ecosistema React.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Este proyecto está diseñado para acelerar el desarrollo,
              manteniendo altos estándares de calidad, rendimiento y
              mantenibilidad.
            </p>
          </section>

          {/* Technologies Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Stack Tecnológico
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
                <h3 className="mb-2 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="mr-2 text-2xl">⚡</span>
                  Frontend
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    Next.js 14 con App Router
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    React 18.3
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    TypeScript 5.9
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    Tailwind CSS 3.4
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-950 dark:ring-1 dark:ring-gray-800">
                <h3 className="mb-2 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="mr-2 text-2xl">🛠️</span>
                  Herramientas
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    Vitest 3.2 para testing
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    ESLint 9 para linting
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    pnpm para gestión de paquetes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">→</span>
                    Vercel para deployment
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Características Principales
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start">
                <span className="mr-3 text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    TypeScript Estricto
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tipado fuerte para código más seguro
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Testing Integrado
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vitest configurado y listo para usar
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Diseño Responsivo
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mobile-first con Tailwind CSS
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Optimización Automática
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Next.js optimiza tu código automáticamente
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              ¿Listo para comenzar?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Empieza a construir tu próxima aplicación con esta base sólida.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                Volver al Inicio
              </Link>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                Ver Documentación
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
