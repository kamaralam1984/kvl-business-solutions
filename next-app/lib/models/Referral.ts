import { Schema, models, model } from 'mongoose';

const ReferralSchema = new Schema({
  referrerEmail: { type: String, required: true, lowercase: true, index: true, unique: true },
  code: { type: String, required: true, unique: true, index: true },
  clicksCount: { type: Number, default: 0 },
  signupsCount: { type: Number, default: 0 },
  // Persisted cache of the on-read computation in lib/referrals.ts (a referred
  // Lead whose linked Deal reached the 'won' stage). Kept in sync there instead
  // of via a write-time hook on Deal updates.
  conversionsCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Referral = models.Referral || model('Referral', ReferralSchema);
