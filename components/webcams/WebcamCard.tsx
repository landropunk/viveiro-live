'use client';

import { useState, useEffect } from 'react';

type WebcamType = 'image' | 'iframe';

type WebcamCardProps = {
  id: string;
  name: string;
  location: string;
  url: string;
  type: WebcamType;
  refreshInterval?: number; // en segundos, solo para tipo 'image'
};

export default function WebcamCard({
  id,
  name,
  location,
  url,
  type,
  refreshInterval = 30,
}: WebcamCardProps) {
  const [imageUrl, setImageUrl] = useState(url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Auto-refresh para imágenes estáticas
  useEffect(() => {
    if (type !== 'image') return;

    const interval = setInterval(() => {
      // Añadir timestamp para evitar caché
      const timestamp = new Date().getTime();
      setImageUrl(`${url.split('?')[0]}?t=${timestamp}`);
      setImageError(false);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [type, url, refreshInterval]);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Card normal */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
        </div>

        {/* Webcam content */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-950">
          {type === 'image' ? (
            imageError ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto mb-2 h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No se pudo cargar la imagen
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`Webcam ${name}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            )
          ) : (
            <iframe
              src={url}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              title={`Webcam ${name}`}
            />
          )}

          {/* Botón pantalla completa */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-2 right-2 rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            title="Pantalla completa"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>

        {/* Footer con info */}
        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {type === 'image' ? `Actualiza cada ${refreshInterval}s` : 'Stream en vivo'}
            </span>
            <span className="flex items-center">
              <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              En directo
            </span>
          </div>
        </div>
      </div>

      {/* Modal pantalla completa */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black"
          onClick={toggleFullscreen}
        >
          <div className="flex h-full w-full items-center justify-center p-4">
            {/* Botón cerrar */}
            <button
              onClick={toggleFullscreen}
              className="absolute right-4 top-4 rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              title="Cerrar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Contenido */}
            <div className="relative h-full w-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
              {type === 'image' ? (
                <img
                  src={imageUrl}
                  alt={`Webcam ${name}`}
                  className="h-full w-full object-contain"
                  onError={handleImageError}
                />
              ) : (
                <iframe
                  src={url}
                  className="h-full w-full"
                  allow="autoplay; fullscreen"
                  title={`Webcam ${name}`}
                />
              )}

              {/* Información en pantalla completa */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-4 py-2 text-white backdrop-blur-sm">
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm opacity-80">{location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
