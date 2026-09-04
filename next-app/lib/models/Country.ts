import { Schema, models, model } from 'mongoose';

const CountrySchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroDescription: { type: String, required: true },
  intro: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  seo: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ogImage: String,
  },
}, { timestamps: true });

export const Country = models.Country || model('Country', CountrySchema);
