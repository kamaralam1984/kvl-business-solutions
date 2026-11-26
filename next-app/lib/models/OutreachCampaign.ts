import { Schema, models, model } from 'mongoose';

// A cold-outreach campaign template. By default this is draft-only — an
// admin generates a per-prospect draft (subject/body with {{name}}/
// {{company}} filled in) and sends it themselves via their own email client
// (mailto:) or LinkedIn.
//
// When `autoSend` is on (email channel only), the outreach-send and
// outreach-check-replies crons take over: an AI-personalized pitch (with the
// portfolio PDF attached) goes out automatically, replies are polled from a
// shared inbox (IMAP, see .env.example OUTREACH_IMAP_*) and answered by AI,
// and the owner is emailed once a prospect looks ready to buy. This is real
// unsolicited cold email sent without per-message human review — an admin
// must explicitly opt a campaign into it, and `dailySendLimit` exists to cap
// blast size and protect inbox/domain reputation.
const OutreachCampaignSchema = new Schema({
  name: { type: String, required: true },
  channel: { type: String, enum: ['email', 'linkedin'], default: 'email' },
  subjectTemplate: { type: String, default: '' },
  bodyTemplate: { type: String, required: true },
  status: { type: String, enum: ['draft', 'active', 'paused'], default: 'draft' },
  createdByEmail: { type: String, required: true, lowercase: true },

  autoSend: { type: Boolean, default: false },
  dailySendLimit: { type: Number, default: 15 },
}, { timestamps: true });

export const OutreachCampaign = models.OutreachCampaign || model('OutreachCampaign', OutreachCampaignSchema);
