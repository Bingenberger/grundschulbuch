import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Camera is needed later for the QR login on the iPads.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=()' },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: { cpus: 1 },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }, { source: '/kinder/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }] }];
  },
};

export default nextConfig;
