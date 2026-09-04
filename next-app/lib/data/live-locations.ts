import { connectDB } from '@/lib/mongodb';
import { Country } from '@/lib/models/Country';
import { LocationPage } from '@/lib/models/LocationPage';

export type Faq = { q: string; a: string };

export type LocationPageType = {
  _id: string;
  country: string;
  regionType: 'state' | 'union_territory' | 'region' | 'city';
  name: string;
  slug: string;
  status: 'draft' | 'published';
  h1: string;
  heroTagline: string;
  introContent: string;
  businessContext: string[];
  whyChooseReasons: string[];
  industriesIntro?: string;
  timezoneOverlap: string;
  processIntro?: string;
  ctaBannerDesc: string;
  faq: Faq[];
  relatedServiceSlugs: string[];
  relatedIndustryLandingSlugs: string[];
  relatedCaseStudySlugs: string[];
  seo: {
    title: string;
    metaDescription: string;
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    seoSlug?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
    schemaType?: string;
    breadcrumbTitle?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CountryType = {
  _id: string;
  slug: string;
  name: string;
  heroTitle: string;
  heroDescription: string;
  intro: string;
  status: 'draft' | 'published';
  seo: { title: string; description: string; ogImage?: string };
  createdAt: string;
  updatedAt: string;
};

function toPlain<T>(doc: any): T {
  const { _id, __v, ...rest } = doc;
  return { _id: _id.toString(), ...rest } as T;
}

// Same 30s-TTL cache convention as getLiveBlogPosts() — avoids a DB round-trip on
// every request while keeping admin edits visible within roughly one cache window.
let locationsCache: { data: LocationPageType[]; ts: number } | null = null;
let countriesCache: { data: CountryType[]; ts: number } | null = null;
const TTL = 30_000;

export async function getLiveCountries(includeDrafts = false): Promise<CountryType[]> {
  if (!includeDrafts && countriesCache && Date.now() - countriesCache.ts < TTL) {
    return countriesCache.data;
  }
  await connectDB();
  const query = includeDrafts ? {} : { status: 'published' };
  const docs = await Country.find(query).sort({ name: 1 }).lean();
  const data = docs.map(d => toPlain<CountryType>(d));
  if (!includeDrafts) countriesCache = { data, ts: Date.now() };
  return data;
}

export async function getLiveCountry(slug: string): Promise<CountryType | null> {
  await connectDB();
  const doc = await Country.findOne({ slug, status: 'published' }).lean();
  return doc ? toPlain<CountryType>(doc) : null;
}

export async function getLiveLocationPages(country?: string, includeDrafts = false): Promise<LocationPageType[]> {
  if (!includeDrafts && locationsCache && Date.now() - locationsCache.ts < TTL) {
    return country ? locationsCache.data.filter(l => l.country === country) : locationsCache.data;
  }
  await connectDB();
  const query = includeDrafts ? {} : { status: 'published' };
  const docs = await LocationPage.find(query).sort({ name: 1 }).lean();
  const data = docs.map(d => toPlain<LocationPageType>(d));
  if (!includeDrafts) locationsCache = { data, ts: Date.now() };
  return country ? data.filter(l => l.country === country) : data;
}

export async function getLiveLocationPage(country: string, slug: string): Promise<LocationPageType | null> {
  await connectDB();
  const doc = await LocationPage.findOne({ country, slug, status: 'published' }).lean();
  return doc ? toPlain<LocationPageType>(doc) : null;
}
