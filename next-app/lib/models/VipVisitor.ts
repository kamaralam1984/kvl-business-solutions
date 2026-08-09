import { Schema, models, model } from 'mongoose';

// One document per first-party `vip_vid` cookie (2-year expiry, set by
// components/vip/VipTracker.tsx). This is the durable visitor identity —
// intentionally cookie-based, not device-fingerprinted (canvas/WebGL/audio
// fingerprinting was evaluated and rejected: declining real-world accuracy
// as browsers strip it, and real legal exposure — see PHASE22-VIP-ARCHITECTURE.md §2.1).
const VipVisitorSchema = new Schema({
  vid: { type: String, required: true, unique: true, index: true },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now, index: true },
  sessionCount: { type: Number, default: 0 },
  pageViewCount: { type: Number, default: 0 },

  // Set the moment this visitor is identifiable via a real-world action —
  // never inferred, only linked when a Lead/Deal/User record actually
  // references this vip_vid (see lib/vip/link.ts).
  knownLeadId: { type: Schema.Types.ObjectId, ref: 'Lead', default: null, index: true },
  knownDealId: { type: Schema.Types.ObjectId, ref: 'Deal', default: null },
  knownUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  knownName: String,
  knownEmail: String,
  knownPhone: String,

  // Company Intelligence (Module 10) — deliberately descoped, no vendor
  // connected. Field kept so the schema doesn't need a migration if/when a
  // vendor budget is approved later; always null until then.
  companyMatchId: { type: Schema.Types.ObjectId, ref: 'VipCompanyMatch', default: null },
}, { timestamps: true });

export const VipVisitor = models.VipVisitor || model('VipVisitor', VipVisitorSchema);
