import { Schema, models, model } from 'mongoose';

const FaqSchema = new Schema({ q: String, a: String }, { _id: false });

const CountrySchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroDescription: { type: String, required: true },
  intro: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },

  // 'hub' = India-style parent page listing its Location Pages (states/UTs).
  // 'standalone' = a full, self-contained marketing/SEO page for a country
  // that has no sub-regions of its own (e.g. USA, UAE, Singapore).
  pageType: { type: String, enum: ['hub', 'standalone'], default: 'hub', index: true },

  // Rich content — only used when pageType === 'standalone'. Mirrors LocationPage's
  // shape so the same admin/content patterns and template logic can be reused.
  businessContext: [{ type: String }],
  whyChooseReasons: [{ type: String }],
  industriesIntro: { type: String, default: '' },
  timezoneOverlap: { type: String, default: '' },
  processIntro: { type: String, default: '' },
  ctaBannerDesc: { type: String, default: '' },
  faq: [FaqSchema],
  gallery: [{ type: String }],

  relatedServiceSlugs: [String],
  relatedIndustryLandingSlugs: [String],
  relatedCaseStudySlugs: [String],

  seo: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ogImage: String,
    primaryKeyword: String,
    secondaryKeywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    twitterTitle: String,
    twitterDescription: String,
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    schemaType: { type: String, default: 'Service' },
    breadcrumbTitle: String,
  },
}, { timestamps: true });

export const Country = models.Country || model('Country', CountrySchema);
