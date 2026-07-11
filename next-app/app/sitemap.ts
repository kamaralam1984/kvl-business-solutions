import type { MetadataRoute } from 'next';
import { softwareProducts } from '@/lib/data/software';
import { docArticles } from '@/lib/data/docs';
import { courses } from '@/lib/data/courses';
import { caseStudies } from '@/lib/data/case-studies';
import { industries } from '@/lib/data/industries';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog';
import { countryPages } from '@/lib/data/country-pages';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
  const now = new Date();

  const staticPaths = [
    '', 'about', 'services', 'software', 'industries', 'projects', 'clients',
    'website-demos', 'contact', 'support', 'faq', 'pricing', 'book-demo', 'docs', 'brand',
    'voice', 'mock-interview', 'careers', 'learn', 'downloads', 'blog', 'global',
    'software-development-company-patna', 'site-map',
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
    ...caseStudies.map(c => ({
      url: `${site}/projects/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...industries.map(i => ({
      url: `${site}/industries/${i.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...services.map(s => ({
      url: `${site}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...docArticles.map(a => ({
      url: `${site}/docs/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...courses.map(c => ({
      url: `${site}/learn/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...blogPosts.map(b => ({
      url: `${site}/blog/${b.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...countryPages.map(c => ({
      url: `${site}/software-development-company-${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...industryLandingPages.map(i => ({
      url: `${site}/${i.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
