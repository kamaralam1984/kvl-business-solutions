import { Schema, models, model } from 'mongoose';

const BlogPostSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  publishedAt: { type: String, required: true },
  updatedAt: String,
  author: String,
  category: { type: String, required: true },
  readingTimeMinutes: { type: Number, default: 5 },
  body: [{ heading: String, content: String }],
  relatedServiceSlugs: [String],
  relatedIndustrySlugs: [String],
  faq: [{ q: String, a: String }],
  seo: { title: String, description: String },
});

export const BlogPost = models.BlogPost || model('BlogPost', BlogPostSchema);
