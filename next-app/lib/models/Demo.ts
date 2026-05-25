import { Schema, models, model } from 'mongoose';

const DemoSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  url: String,                                  // live URL if any (https://vidyt.com)
  category: { type: String, default: 'business', index: true },
  technologies: { type: [String], default: [] },
  live: { type: Boolean, default: false },       // true = real production site, false = design demo
  image: String,                                 // optional Cloudinary image URL
  imagePublicId: String,
  iconName: { type: String, default: 'Globe' },  // lucide-react icon name
  c1: { type: String, default: '#3b82f6' },      // gradient color 1
  c2: { type: String, default: '#1d4ed8' },      // gradient color 2
  order: { type: Number, default: 0, index: true },
  active: { type: Boolean, default: true, index: true },
  startingPrice: { type: Number, default: 14999 },
}, { timestamps: true });

DemoSchema.index({ active: 1, order: 1, createdAt: -1 });

export const Demo = models.Demo || model('Demo', DemoSchema);

// Re-export for backward compat — actual definition in lib/data/demo-categories.ts
export { DEMO_CATEGORIES } from '../data/demo-categories';
