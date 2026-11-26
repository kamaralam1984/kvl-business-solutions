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

  // Subject line of the initial AI pitch (autoSend only) — reused as
  // "Re: {pitchSubject}" for AI negotiation replies so the thread stays
  // recognizable in the prospect's inbox.
  pitchSubject: String,

  // Full auto-outreach transcript (only populated for autoSend campaigns) —
  // 'assistant' is KVL's AI (initial pitch + every negotiation reply),
  // 'prospect' is a reply pulled in from the shared inbox via IMAP.
  conversation: [{
    role: { type: String, enum: ['assistant', 'prospect'] },
    body: String,
    at: { type: Date, default: Date.now },
  }],
  // Set once the AI negotiator judges this prospect ready to buy and the
  // owner has been emailed — guards against notifying the owner twice for
  // the same prospect across repeated reply-check cron runs.
  readyNotifiedAt: Date,
}, { timestamps: true });

OutreachProspectSchema.index({ campaignId: 1, status: 1 });

export const OutreachProspect = models.OutreachProspect || model('OutreachProspect', OutreachProspectSchema);
