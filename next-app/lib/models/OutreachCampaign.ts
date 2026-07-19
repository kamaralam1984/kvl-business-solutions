import { Schema, models, model } from 'mongoose';

// A cold-outreach campaign template — drafts only, never sends on its own.
// An admin generates a per-prospect draft (subject/body with {{name}}/
// {{company}} filled in) and sends it themselves via their own email client
// (mailto:) or LinkedIn — the system never holds SMTP/LinkedIn credentials
// and never pushes a send.
const OutreachCampaignSchema = new Schema({
  name: { type: String, required: true },
  channel: { type: String, enum: ['email', 'linkedin'], default: 'email' },
  subjectTemplate: { type: String, default: '' },
  bodyTemplate: { type: String, required: true },
  status: { type: String, enum: ['draft', 'active', 'paused'], default: 'draft' },
  createdByEmail: { type: String, required: true, lowercase: true },
}, { timestamps: true });

export const OutreachCampaign = models.OutreachCampaign || model('OutreachCampaign', OutreachCampaignSchema);
