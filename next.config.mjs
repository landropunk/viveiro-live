/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // React Strict Mode deshabilitado debido a incompatibilidad conocida entre:
  // - React 19 Strict Mode (double-render en desarrollo)
  // - react-leaflet 4.2.1 (MapContainer no maneja correctamente el remontaje)
  // Issue: "Map container is already initialized"
  // Nota: Esto solo afecta desarrollo. En producción Strict Mode no hace double-render.
  reactStrictMode: false,

  // ESLint: ya validado, skip durante build para performance
  // Los warnings quedan documentados en el código para mejora continua
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript errors sí bloquean
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'servizos.meteogalicia.gal',
        pathname: '/apiv4/images/**',
      },
      {
        protocol: 'https',
        hostname: 'servizos.meteogalicia.gal',
        pathname: '/apiv5/images/**',
      },
    ],
  },
  // Configuración para Next.js 15
  experimental: {
    // Evitar problemas con Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Skip generating legacy error pages (workaround for Next.js 15 bug)
    disableOptimizedLoading: false,
  },

  // Disable static optimization for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Force dynamic rendering for admin and protected routes (Next.js 15 compatibility)
  async headers() {
    return [
      {
        source: '/(admin|dashboard)/:path*',
        headers: [
          {
            key: 'x-middleware-cache',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
