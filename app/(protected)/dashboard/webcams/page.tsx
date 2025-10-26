'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import WebcamCard from '@/components/webcams/WebcamCard';

type Webcam = {
  id: string;
  name: string;
  location: string;
  url: string;
  type: 'image' | 'iframe';
  refreshInterval?: number;
};

const webcams: Webcam[] = [
  {
    id: 'penedo-galo',
    name: 'Penedo do Galo',
    location: 'MeteoGalicia - Viveiro',
    url: 'https://www.meteogalicia.gal/datosred/camaras/MeteoGalicia/Penedodogalo/ultima.jpg',
    type: 'image',
    refreshInterval: 30, // 30 segundos
  },
  {
    id: 'xandins-noriega',
    name: 'Xandíns Noriega Varela',
    location: 'AngelCam - Viveiro',
    url: 'https://v.angelcam.com/iframe?v=enr0e6z7l8&autoplay=1',
    type: 'iframe',
  },
];

export default function WebcamsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al portal
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            📷 Webcams de Viveiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cámaras en directo de diferentes ubicaciones de Viveiro
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-300">
                Información sobre las webcams
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Las imágenes se actualizan automáticamente cada 30 segundos. Haz clic en el icono
                de pantalla completa para ver la webcam en modo inmersivo.
              </p>
            </div>
          </div>
        </div>

        {/* Webcams Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {webcams.map((webcam) => (
            <WebcamCard
              key={webcam.id}
              id={webcam.id}
              name={webcam.name}
              location={webcam.location}
              url={webcam.url}
              type={webcam.type}
              refreshInterval={webcam.refreshInterval}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">📷</div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Acerca de las webcams
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Las webcams proporcionan vistas en tiempo real de diferentes ubicaciones de Viveiro.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Penedo do Galo:</strong> Cámara de MeteoGalicia con vista panorámica,
                    actualización cada 30 segundos
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Xandíns Noriega Varela:</strong> Stream de video en directo vía AngelCam
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sugerencia para más webcams */}
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto mb-3 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              ¿Conoces más webcams de Viveiro?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Si conoces otras cámaras públicas que deberíamos añadir, háznoslo saber.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
