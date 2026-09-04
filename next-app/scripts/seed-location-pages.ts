/* eslint-disable */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Country } from '../lib/models/Country';
import { LocationPage } from '../lib/models/LocationPage';

const SCRATCH_DIR = process.env.LOCATION_SEED_DIR
  || '/tmp/claude-1000/-home-kamar-alam-Project-kvl-business-solutions/8aab7699-8553-47c6-96a2-4ffb17fe1db6/scratchpad';

const BATCH_FILES = [
  'locations-batch-1.json',
  'locations-batch-2.json',
  'locations-batch-3.json',
  'locations-batch-4.json',
  'locations-batch-5.json',
  'locations-batch-6.json',
];

const EXPECTED_SLUGS = [
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa',
  'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala',
  'madhya-pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland',
  'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu', 'telangana',
  'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal',
  'andaman-and-nicobar-islands', 'chandigarh', 'dadra-and-nagar-haveli-and-daman-and-diu',
  'delhi', 'jammu-and-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
];

const ALLOWED_SERVICE_SLUGS = new Set([
  'custom-software', 'website', 'android', 'gps', 'civil', 'mechanical', 'automation',
  'cctv', 'erp', 'cloud', 'ai', 'digital-marketing', 'branding', 'consultancy', 'crm',
  'api-development', 'white-label', 'enterprise-integrations',
]);
const ALLOWED_INDUSTRY_SLUGS = new Set([
  'construction-erp-software-development', 'finance-banking-software-development',
  'government-digital-solutions', 'healthcare-software-development',
  'hospital-management-software-development', 'logistics-fleet-management-software',
  'manufacturing-erp-development', 'real-estate-software-development',
  'restaurant-pos-software-development', 'retail-software-development',
  'school-erp-development',
]);
const ALLOWED_CASE_STUDY_SLUGS = new Set([
  'vidyt', 'aapkaplot', 'gravity', 'restro-os', 'kvl-crm', 'kvl-growthos',
  'kvl-super-ai', 'kvl-international-school',
]);

function sanitizeSlugList(list: unknown, allowed: Set<string>, field: string, locationSlug: string): string[] {
  if (!Array.isArray(list)) return [];
  const out = list.filter((s: unknown) => typeof s === 'string' && allowed.has(s));
  const dropped = list.filter((s: unknown) => typeof s !== 'string' || !allowed.has(s as string));
  if (dropped.length) console.warn(`  [${locationSlug}] dropped invalid ${field}: ${JSON.stringify(dropped)}`);
  return out;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected.');

  // Country hub doc
  await Country.findOneAndUpdate(
    { slug: 'india' },
    {
      slug: 'india',
      name: 'India',
      heroTitle: 'Software Development Services',
      heroDescription: 'KVL Business Solutions builds custom software, ERP, CRM, and AI automation for businesses across every Indian state and union territory — one accountable engineering team, delivered remotely from our Patna, Bihar headquarters.',
      intro: 'We serve clients across all 28 states and 8 union territories of India — no franchise network, no subcontracted regional partners, just one in-house team delivering every project end to end.',
      status: 'published',
      seo: {
        title: 'Software Development Company Across India | KVL Business Solutions',
        description: 'Custom software, ERP, CRM, GPS fleet tracking, and AI automation for businesses across every Indian state and union territory, delivered by KVL Business Solutions\' Patna-based engineering team.',
      },
    },
    { upsert: true, new: true }
  );
  console.log('Upserted Country: india');

  let all: any[] = [];
  for (const file of BATCH_FILES) {
    const full = path.join(SCRATCH_DIR, file);
    if (!fs.existsSync(full)) {
      console.warn(`Missing batch file, skipping: ${full}`);
      continue;
    }
    const parsed = JSON.parse(fs.readFileSync(full, 'utf-8'));
    if (!Array.isArray(parsed)) throw new Error(`${file} did not contain a JSON array`);
    all = all.concat(parsed);
  }

  console.log(`Loaded ${all.length} location entries from ${BATCH_FILES.length} batch files.`);

  const seenSlugs = new Set<string>();
  let upserted = 0;
  for (const loc of all) {
    if (!loc.slug || !loc.name || !loc.h1 || !loc.seo?.title) {
      console.warn(`Skipping malformed entry: ${JSON.stringify(loc).slice(0, 120)}`);
      continue;
    }
    if (seenSlugs.has(loc.slug)) {
      console.warn(`Duplicate slug across batches, skipping second occurrence: ${loc.slug}`);
      continue;
    }
    seenSlugs.add(loc.slug);

    const doc = {
      country: 'india',
      regionType: loc.regionType === 'union_territory' ? 'union_territory' : 'state',
      name: loc.name,
      slug: loc.slug,
      // Seeded as drafts — review and publish each one from Admin → Location Pages.
      status: 'draft',
      h1: loc.h1,
      heroTagline: loc.heroTagline,
      introContent: loc.introContent,
      businessContext: Array.isArray(loc.businessContext) ? loc.businessContext : [],
      whyChooseReasons: Array.isArray(loc.whyChooseReasons) ? loc.whyChooseReasons : [],
      industriesIntro: loc.industriesIntro || '',
      timezoneOverlap: loc.timezoneOverlap,
      processIntro: loc.processIntro || '',
      ctaBannerDesc: loc.ctaBannerDesc,
      faq: Array.isArray(loc.faq) ? loc.faq : [],
      relatedServiceSlugs: sanitizeSlugList(loc.relatedServiceSlugs, ALLOWED_SERVICE_SLUGS, 'relatedServiceSlugs', loc.slug),
      relatedIndustryLandingSlugs: sanitizeSlugList(loc.relatedIndustryLandingSlugs, ALLOWED_INDUSTRY_SLUGS, 'relatedIndustryLandingSlugs', loc.slug),
      relatedCaseStudySlugs: sanitizeSlugList(loc.relatedCaseStudySlugs, ALLOWED_CASE_STUDY_SLUGS, 'relatedCaseStudySlugs', loc.slug),
      seo: {
        title: loc.seo.title,
        metaDescription: loc.seo.metaDescription,
        primaryKeyword: loc.seo.primaryKeyword || '',
        secondaryKeywords: Array.isArray(loc.seo.secondaryKeywords) ? loc.seo.secondaryKeywords : [],
        breadcrumbTitle: loc.seo.breadcrumbTitle || loc.name,
        robotsIndex: true,
        robotsFollow: true,
        schemaType: 'Service',
      },
    };

    await LocationPage.findOneAndUpdate({ country: 'india', slug: loc.slug }, doc, { upsert: true, new: true });
    upserted += 1;
  }

  console.log(`Upserted ${upserted} location pages.`);

  const missing = EXPECTED_SLUGS.filter(s => !seenSlugs.has(s));
  if (missing.length) {
    console.warn(`WARNING — ${missing.length} expected slugs were not seeded: ${missing.join(', ')}`);
  } else {
    console.log('All 36 expected states/UTs were seeded.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
