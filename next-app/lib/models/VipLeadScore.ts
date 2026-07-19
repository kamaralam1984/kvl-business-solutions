import { Schema, models, model } from 'mongoose';

// Module 9 (AI Lead Scoring) — despite the module name, the score itself is
// a deterministic, explainable rubric computed from real tracked behaviour
// (see lib/vip/lead-score.ts), the same pattern as the existing
// lib/lead-tier.ts rubric for form-submitted leads. "AI" here means the
// signals feeding it are real tracked behaviour, not that an LLM invents a
// number — the brief is explicit that scores must never be invented.
const VipLeadScoreSchema = new Schema({
  vid: { type: String, required: true, unique: true, index: true },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', default: null, index: true },

  score: { type: Number, required: true }, // 0-100
  tier: { type: String, enum: ['hot', 'warm', 'cold'], required: true, index: true },

  // Every point is attributed to a real signal — renders directly as the
  // "why" behind the score in the admin UI, never a black box.
  breakdown: [{
    signal: String,   // e.g. 'session_count', 'pricing_page_visits', 'contact_attempts'
    weight: Number,
    value: Number,     // the raw tracked count/measurement this signal was computed from
    points: Number,    // weight * normalized(value), contribution to the total score
  }],

  computedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const VipLeadScore = models.VipLeadScore || model('VipLeadScore', VipLeadScoreSchema);
