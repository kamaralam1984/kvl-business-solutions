import { Schema, models, model } from 'mongoose';

const ContactSchema = new Schema({
  ownerEmail: { type: String, required: true, lowercase: true, index: true }, // user who owns this CRM record
  name: { type: String, required: true },
  email: String,
  phone: String,
  company: String,
  designation: String,
  source: { type: String, default: 'manual' }, // manual, lead-form, import
  tags: { type: [String], default: [] },
  notes: String,
}, { timestamps: true });

ContactSchema.index({ ownerEmail: 1, createdAt: -1 });

export const Contact = models.Contact || model('Contact', ContactSchema);
