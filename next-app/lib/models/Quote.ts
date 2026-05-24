import { Schema, models, model } from 'mongoose';

const QuoteSchema = new Schema({
  type: String,
  scope: String,
  timeline: String,
  estimateLow: Number,
  estimateHigh: Number,
  contact: {
    name: String,
    email: { type: String, index: true },
    phone: String,
  },
  status: { type: String, enum: ['draft', 'submitted', 'follow-up', 'closed'], default: 'submitted' },
}, { timestamps: true });

export const Quote = models.Quote || model('Quote', QuoteSchema);
