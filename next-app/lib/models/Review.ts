import { Schema, models, model } from 'mongoose';

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  company: String,
  productSlug: { type: String, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  message: { type: String, required: true },
  approved: { type: Boolean, default: false, index: true },
  featured: { type: Boolean, default: false, index: true },
}, { timestamps: true });

ReviewSchema.index({ productSlug: 1, approved: 1, createdAt: -1 });

export const Review = models.Review || model('Review', ReviewSchema);
