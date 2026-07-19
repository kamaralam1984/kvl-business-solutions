import { Schema, models, model } from 'mongoose';

// Module 7 (Page Intelligence) — one document per page the visitor viewed
// within a session. `exitedAt`/`timeOnPageSeconds` are updated by the next
// event in the same session (or by the beforeunload/pagehide beacon), not
// estimated.
const VipPageViewSchema = new Schema({
  sessionId: { type: String, required: true, index: true },
  vid: { type: String, required: true, index: true },
  path: { type: String, required: true, index: true },

  enteredAt: { type: Date, default: Date.now },
  exitedAt: Date,
  timeOnPageSeconds: { type: Number, default: 0 },

  scrollDepthPct: { type: Number, default: 0 },
  isExit: { type: Boolean, default: false }, // true once confirmed as the session's last pageview
  isBounce: { type: Boolean, default: false }, // true if this was the only pageview in a single-pageview session
}, { timestamps: true });

VipPageViewSchema.index({ path: 1, createdAt: -1 });

export const VipPageView = models.VipPageView || model('VipPageView', VipPageViewSchema);
