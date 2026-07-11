const csp = [
  "default-src 'self'",
  // 'unsafe-inline'/'unsafe-eval' are required by Next.js's own hydration scripts and
  // several existing third-party embeds (GA, Razorpay checkout) — tightening further
  // would need per-script nonces, which is a larger change than this fix covers.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://www.openstreetmap.org",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['three'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async rewrites() {
    return [
      // IndexNow requires the key file at the site root (/{key}.txt) — rewritten
      // internally to the API route so it never shadows real page 404s the way a
      // root-level dynamic page segment would.
      { source: '/:key([a-zA-Z0-9-]+).txt', destination: '/api/indexnow/:key' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
