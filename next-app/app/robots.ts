import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', '/api', '/dashboard',
          // Each demo vertical's dashboard/login is a near-identical UI
          // mockup shell — the demo landing page itself (/demo/erp etc.)
          // already sets noindex; these two levels deeper were reachable
          // and fully indexable, ~26 pages of duplicate/thin content.
          '/demo/*/dashboard', '/demo/*/login',
          // Transactional pages with no unique content per visit/query.
          '/checkout', '/checkout/success', '/search',
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
