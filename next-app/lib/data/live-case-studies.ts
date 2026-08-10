import { caseStudies, type CaseStudy as CaseStudyType } from './case-studies';
import { connectDB } from '@/lib/mongodb';
import { CaseStudy } from '@/lib/models/CaseStudy';

// Admin-created case studies only capture a single hero image (no separate
// desktop/tablet/mobile gallery shots — that needs real device screenshots,
// not something a content form can produce), so the gallery here just
// repeats the hero image under each device label to keep gallery-consuming
// UI from breaking.
function toFullShape(db: any): CaseStudyType {
  return {
    slug: db.slug,
    name: db.name,
    url: db.url,
    tagline: db.tagline,
    industry: db.industry,
    industrySlug: db.industrySlug,
    businessCategory: db.businessCategory,
    overview: db.overview,
    images: {
      hero: db.heroImage,
      gallery: [
        { src: db.heroImage, alt: `${db.name} on desktop`, device: 'desktop' },
        { src: db.heroImage, alt: `${db.name} on tablet`, device: 'tablet' },
        { src: db.heroImage, alt: `${db.name} on mobile`, device: 'mobile' },
      ],
    },
    challenge: { headline: db.challenge?.headline || '', body: db.challenge?.body || '' },
    goals: db.goals || [],
    solution: {
      headline: db.solution?.headline || '',
      body: db.solution?.body || '',
      pillars: db.solution?.pillars || [],
    },
    keyFeatures: db.keyFeatures || [],
    tech: db.tech || [],
    benefits: db.benefits || [],
    relatedServiceSlugs: db.relatedServiceSlugs || [],
    faq: db.faq || [],
    seo: { title: db.seo?.title || db.name, description: db.seo?.description || db.overview },
  };
}

// Cached to avoid a fresh DB round-trip on every page that reads the full
// case-study catalog (homepage, /projects, sitemap, ...) — same 30s TTL as
// getSiteSettings() so admin edits still go live within the same window.
let cache: { data: CaseStudyType[]; ts: number } | null = null;
const TTL = 30_000;

export async function getLiveCaseStudies(): Promise<CaseStudyType[]> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;

  await connectDB();
  const dbStudies = await CaseStudy.find({}).lean();
  const dbBySlug = new Map(dbStudies.map((d: any) => [d.slug, toFullShape(d)]));

  const merged = caseStudies.map(c => dbBySlug.get(c.slug) || c);
  for (const [slug, study] of dbBySlug) {
    if (!caseStudies.some(c => c.slug === slug)) merged.push(study);
  }
  cache = { data: merged, ts: Date.now() };
  return merged;
}

export async function getLiveCaseStudy(slug: string): Promise<CaseStudyType | null> {
  await connectDB();
  const db = await CaseStudy.findOne({ slug }).lean();
  if (db) return toFullShape(db);
  return caseStudies.find(c => c.slug === slug) || null;
}
