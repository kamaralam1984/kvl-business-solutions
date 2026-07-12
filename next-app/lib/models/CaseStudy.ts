import { Schema, models, model } from 'mongoose';

const CaseStudySchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  tagline: { type: String, required: true },
  industry: { type: String, required: true },
  industrySlug: String,
  businessCategory: { type: String, required: true },
  overview: { type: String, required: true },
  heroImage: { type: String, required: true },
  challenge: { headline: String, body: String },
  goals: [String],
  solution: {
    headline: String,
    body: String,
    pillars: [{ title: String, desc: String }],
  },
  keyFeatures: [{ icon: String, title: String, desc: String }],
  tech: [String],
  benefits: [{ title: String, desc: String }],
  relatedServiceSlugs: [String],
  faq: [{ q: String, a: String }],
  seo: { title: String, description: String },
});

export const CaseStudy = models.CaseStudy || model('CaseStudy', CaseStudySchema);
