import { z } from 'zod';

export const countrySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  name: z.string().min(2),
  heroTitle: z.string().min(3),
  heroDescription: z.string().min(10),
  intro: z.string().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  seo: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    ogImage: z.string().optional(),
  }),
});
