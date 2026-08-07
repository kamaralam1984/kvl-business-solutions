const csp = [
  "default-src 'self'",
  // 'unsafe-inline'/'unsafe-eval' are required by Next.js's own hydration scripts and
  // several existing third-party embeds (GA, Razorpay checkout) — tightening further
  // would need per-script nonces, which is a larger change than this fix covers.
  // https://superai.kvlbusinesssolutions.com: the AI chat widget loader
  // (widget.js) — the widget's own chat UI runs inside an iframe (see
  // frame-src below) served from that same origin, so its *own* fetch/
  // WebSocket calls are governed by its own page, not this CSP at all;
  // this parent page only ever directly loads the one <script> tag and
  // creates the one <iframe>.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://checkout.razorpay.com https://superai.kvlbusinesssolutions.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // api.cloudinary.com: FileUploader.tsx uploads directly from the browser
  // to Cloudinary (signed direct upload) — without this, the browser blocks
  // the request and it surfaces as a generic "Failed to fetch".
  // www.facebook.com: Meta Pixel (fbevents.js) sends its tracking beacon here.
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com https://api.cloudinary.com https://www.facebook.com",
  "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://www.openstreetmap.org https://superai.kvlbusinesssolutions.com",
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
          // microphone=(self): Khushi's voice input and /voice both use SpeechRecognition/
          // getUserMedia(audio) — this header is enforced by the browser regardless of what
          // the user clicks in site permissions, so leaving it () made mic access impossible
          // to grant no matter what. Camera/geolocation stay blocked — genuinely unused.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
