import { Schema, models, model } from 'mongoose';

// One document per `vip_sid` (30-minute sliding-expiry session cookie).
// Geo fields are only ever populated from a named, real source — never
// guessed — and the `source` is always recorded alongside the value so a
// reader can tell where it came from (see PHASE22-VIP-ARCHITECTURE.md §2.3).
const VipSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  vid: { type: String, required: true, index: true },

  startedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now, index: true },
  endedAt: Date,

  device: {
    type: { type: String }, // 'desktop' | 'mobile' | 'tablet'
    os: String,
    browser: String,
  },

  referrer: String,
  landingPage: String,
  exitPage: String,
  pageViewCount: { type: Number, default: 0 },
  durationSeconds: { type: Number, default: 0 },

  // First-touch attribution only — captured once, from the landing page's
  // querystring, by the client SDK (no server-side guessing).
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String,
  },
  channel: String, // derived, human-readable classification (google-organic, facebook-ads, direct, referral, ...) — see lib/vip/traffic-source.ts

  // Populated from Vercel's edge geo headers (x-vercel-ip-*), present on
  // every request at zero cost since this app runs behind Vercel's edge
  // network (confirmed via vercel.json's real cron config). Left entirely
  // null/absent — never a guessed default — if those headers aren't present
  // (e.g. local dev, or a non-Vercel host).
  geo: {
    country: String,
    region: String,
    city: String,
    timezone: String,
    latitude: String,
    longitude: String,
    source: String, // e.g. 'vercel-edge'
  },

  // ISP/ASN/proxy/VPN/bot detection — Module 2/Module 4's "verified" tier
  // needs a paid provider (descoped for Phase A, see architecture doc §4).
  // `isBotHeuristic` is the one exception: a transparently-labeled
  // heuristic (zero mouse/scroll activity + instant navigation), never
  // presented as "verified."
  isBotHeuristic: { type: Boolean, default: false },
}, { timestamps: true });

VipSessionSchema.index({ vid: 1, startedAt: -1 });

export const VipSession = models.VipSession || model('VipSession', VipSessionSchema);
