import { Schema, models, model } from 'mongoose';

const FaqSchema = new Schema({ q: String, a: String }, { _id: false });

const LocationPageSchema = new Schema({
  country: { type: String, required: true, index: true }, // Country.slug, e.g. 'india'
  regionType: { type: String, enum: ['state', 'union_territory', 'region', 'city'], required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },

  h1: { type: String, required: true },
  heroTagline: { type: String, required: true },
  introContent: { type: String, required: true },
  businessContext: [{ type: String }],
  whyChooseReasons: [{ type: String }],
  industriesIntro: String,
  timezoneOverlap: { type: String, required: true },
  processIntro: String,
  ctaBannerDesc: { type: String, required: true },
  faq: [FaqSchema],

  relatedServiceSlugs: [String],
  relatedIndustryLandingSlugs: [String],
  relatedCaseStudySlugs: [String],

  seo: {
    title: { type: String, required: true },
    metaDescription: { type: String, required: true },
    primaryKeyword: String,
    secondaryKeywords: [String],
    seoSlug: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    schemaType: { type: String, default: 'Service' },
    breadcrumbTitle: String,
  },
}, { timestamps: true });

LocationPageSchema.index({ country: 1, slug: 1 }, { unique: true });

export const LocationPage = models.LocationPage || model('LocationPage', LocationPageSchema);
