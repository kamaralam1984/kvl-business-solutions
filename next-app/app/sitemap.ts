import type { MetadataRoute } from 'next';
import { docArticles } from '@/lib/data/docs';
import { industries } from '@/lib/data/industries';
import { services } from '@/lib/data/services';
import { countryPages } from '@/lib/data/country-pages';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { getLiveCaseStudies } from '@/lib/data/live-case-studies';
import { getLiveCourses } from '@/lib/data/live-courses';
import { getLiveBlogPosts } from '@/lib/data/live-blog';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
  const now = new Date();

  await connectDB();
  const [softwareProducts, caseStudies, courses, blogPosts, jobs] = await Promise.all([
    getLiveSoftwareProducts(),
    getLiveCaseStudies(),
    getLiveCourses(),
    getLiveBlogPosts(),
    Job.find({ active: true }, { slug: 1 }).lean(),
  ]);

  const staticPaths = [
    '', 'about', 'services', 'software', 'industries', 'projects', 'clients',
    'website-demos', 'website-offer', 'contact', 'support', 'faq', 'pricing', 'book-demo', 'docs', 'brand',
    'voice', 'mock-interview', 'careers', 'learn', 'downloads', 'blog', 'global', 'reviews',
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
    ...jobs.map((j: any) => ({
      url: `${site}/careers/${j.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
