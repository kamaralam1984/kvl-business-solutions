import { Schema, models, model } from 'mongoose';

const BookingSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  company: String,
  product: String,
  preferredDate: Date,
  preferredTime: String,
  notes: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
  source: { type: String, default: 'website' },
}, { timestamps: true });

export const Booking = models.Booking || model('Booking', BookingSchema);
