import mongoose, { Schema, models, model } from 'mongoose';

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  service: String,
  message: String,
  source: { type: String, default: 'contact-form' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'won', 'lost'], default: 'new', index: true },
  notes: String,
}, { timestamps: true });

export const Lead = models.Lead || model('Lead', LeadSchema);
