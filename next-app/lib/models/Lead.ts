import { Schema, models, model } from 'mongoose';

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  service: String,
  message: String,
  source: { type: String, default: 'contact-form' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'won', 'lost'], default: 'new', index: true },
  notes: String,

  // Explicit qualification fields (collected on the contact form)
  companyName: String,
  country: String,
  businessType: String,   // e.g. "Startup", "SME", "Enterprise", "Government", "Individual"
  budget: String,          // e.g. "₹5,00,000 – ₹15,00,000"
  timeline: String,        // e.g. "Within 1 month"
  leadTier: { type: String, enum: ['high', 'medium', 'low'], default: 'low', index: true }, // deterministic, rule-based

  // AI-generated fields
  aiScore: { type: Number, default: 0, index: true },        // 0-100
  intent: { type: String, enum: ['hot', 'warm', 'cold', 'unknown'], default: 'unknown', index: true },
  aiInsights: {
    budget: String,        // e.g. "₹50,000–₹1,00,000"
    timeline: String,      // e.g. "Within 1 month"
    companyType: String,   // e.g. "Manufacturing SME"
    urgency: String,       // e.g. "High — mentioned 'asap'"
    nextAction: String,    // e.g. "Call within 2 hours"
    summary: String,       // 1-line AI summary
  },
  chatMessages: [{ role: String, content: String }], // for chatbot-sourced leads
  aiScoredAt: Date,

  // AI Call tracking
  callStatus: { type: String, enum: ['not_called', 'calling', 'completed', 'failed', 'no_answer'], default: 'not_called' },
  callId: String,
  callDuration: Number,
  callRecordingUrl: String,
  calledAt: Date,

  // Smart follow-up sequence
  followUpStage: { type: Number, default: 0 },
  followUpNextAt: { type: Date },
  followUpDone: { type: Boolean, default: false },

  // AI lead nurturing
  lastNurtureAt: Date,
  nurtureCount: { type: Number, default: 0 },

  // Review request
  reviewRequestSent: { type: Boolean, default: false },

  // Lead-to-Deal automation: set when a Deal has been auto-created for this lead
  // (on status -> 'qualified'), so we never create a duplicate Deal for the same lead.
  dealId: { type: Schema.Types.ObjectId, ref: 'Deal', default: null },

  // Referral attribution: set from the `kvl_ref` cookie (captured by middleware.ts
  // from a ?ref=<code> query param) when this lead was submitted, if that code
  // matches a real Referral document. See lib/referrals.ts for conversion tracking.
  referralCode: { type: String, index: true },
}, { timestamps: true });

export const Lead = models.Lead || model('Lead', LeadSchema);
