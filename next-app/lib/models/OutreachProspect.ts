import { Schema, models, model } from 'mongoose';
import { PROSPECT_STATUSES } from '../constants/outreach';
export { PROSPECT_STATUSES } from '../constants/outreach';
export type { ProspectStatus } from '../constants/outreach';

// A single cold-outreach target within a campaign. Status is set manually by
// the admin (there's no inbox/LinkedIn API integration to auto-detect opens
// or replies) — this is real tracked state, just human-entered rather than
// automated. `convertedDealId` links to the real CRM once a prospect
// converts, so outreach and the sales pipeline share one source of truth.
const OutreachProspectSchema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: 'OutreachCampaign', required: true, index: true },
  name: { type: String, required: true },
  email: String,
  linkedinUrl: String,
  company: String,
  status: { type: String, enum: PROSPECT_STATUSES, default: 'pending', index: true },
  notes: String,
  lastContactedAt: Date,
  convertedDealId: { type: Schema.Types.ObjectId, ref: 'Deal' },
}, { timestamps: true });

OutreachProspectSchema.index({ campaignId: 1, status: 1 });

export const OutreachProspect = models.OutreachProspect || model('OutreachProspect', OutreachProspectSchema);
