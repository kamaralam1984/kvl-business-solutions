import { Schema, models, model } from 'mongoose';

const ProductSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  features: [String],
  price: { type: Number, required: true },
  unit: { type: String, default: '/year' },
  active: { type: Boolean, default: true },
  tag: String,
  image: String,
  imagePublicId: String,
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);
