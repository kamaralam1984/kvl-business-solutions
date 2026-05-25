import type { MetadataRoute } from 'next';
import { softwareProducts } from '@/lib/data/software';
import { docArticles } from '@/lib/data/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlsolutions.in';
  const now = new Date();

  const staticPaths = [
    '', 'about', 'services', 'software', 'industries', 'projects', 'clients',
    'website-demos', 'contact', 'support', 'faq', 'pricing', 'book-demo', 'docs', 'brand',
    'privacy', 'terms', 'refund-policy', 'shipping-policy',
    'login', 'register',
  ];

  return [
    ...staticPaths.map(p => ({
      url: `${site}/${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.7,
    })),
    ...softwareProducts.map(s => ({
      url: `${site}/software/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...docArticles.map(a => ({
      url: `${site}/docs/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
