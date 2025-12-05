/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
};

export default nextConfig;
