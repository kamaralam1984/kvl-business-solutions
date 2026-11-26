import { z } from 'zod';

export const countrySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  name: z.string().min(2),
  heroTitle: z.string().min(3),
  heroDescription: z.string().min(10),
  intro: z.string().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  pageType: z.enum(['hub', 'standalone']).default('hub'),

  businessContext: z.array(z.string()).default([]),
  whyChooseReasons: z.array(z.string()).default([]),
  industriesIntro: z.string().default(''),
  timezoneOverlap: z.string().default(''),
  processIntro: z.string().default(''),
  ctaBannerDesc: z.string().default(''),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  gallery: z.array(z.string()).default([]),

  relatedServiceSlugs: z.array(z.string()).default([]),
  relatedIndustryLandingSlugs: z.array(z.string()).default([]),
  relatedCaseStudySlugs: z.array(z.string()).default([]),

  seo: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    ogImage: z.string().optional(),
    primaryKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).default([]),
    canonicalUrl: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    robotsIndex: z.boolean().default(true),
    robotsFollow: z.boolean().default(true),
    schemaType: z.string().default('Service'),
    breadcrumbTitle: z.string().optional(),
  }),
});
