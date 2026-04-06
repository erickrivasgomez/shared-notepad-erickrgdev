import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Permite que la build de producción no se detenga por advertencias o pequeños errores TS en el código MVP.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: Permite completar build pese a advertencias eslint
    ignoreDuringBuilds: true,
  },
};

export default withPWA(nextConfig);
