import { Schema, models, model } from 'mongoose';

export const DEAL_STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'repeat', 'lost'] as const;
export type DealStage = typeof DEAL_STAGES[number];

const DealSchema = new Schema({
  ownerEmail: { type: String, required: true, lowercase: true, index: true },
  title: { type: String, required: true },
  contactName: String,
  contactEmail: String,
  contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
  reviewRequestedAt: Date,
  value: { type: Number, default: 0 },
  stage: { type: String, enum: DEAL_STAGES, default: 'lead', index: true },
  probability: { type: Number, default: 20 }, // 0-100
  expectedCloseDate: Date,
  source: String,
  notes: String,
  lastAction: String,
  aiSuggestion: String,
  tags: { type: [String], default: [] },
}, { timestamps: true });

DealSchema.index({ ownerEmail: 1, stage: 1, createdAt: -1 });

export const Deal = models.Deal || model('Deal', DealSchema);
