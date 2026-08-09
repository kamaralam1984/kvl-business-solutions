import { Schema, models, model } from 'mongoose';

const SiteSettingsSchema = new Schema({
  // Singleton flag — only one document allowed
  _id: { type: String, default: 'main' },

  // Brand
  brandName: { type: String, default: 'KVL Business Solutions' },
  tagline: { type: String, default: 'India\'s next-generation business technology' },

  // Contact info (used in footer, contact page, structured data)
  phone: { type: String, default: '+91 99420 00413' },
  phone2: { type: String, default: '' },
  email: { type: String, default: 'info@kvlbusinesssolutions.com' },
  supportEmail: { type: String, default: 'support@kvlbusinesssolutions.com' },
  salesEmail: { type: String, default: 'kvlbusinesssolution@gmail.com' },
  whatsapp: { type: String, default: '919942000413' },
  whatsappSupportText: { type: String, default: '24×7 support' },
  addressLine1: { type: String, default: 'Patna, Sultanganj, Bihar, India' },
  addressLine2: { type: String, default: '' },
  branches: { type: String, default: 'Delhi, Bangalore, Mumbai' },
  gstin: { type: String, default: '27AAAAA0000A1Z5' },

  // Business hours
  businessHours: { type: String, default: 'Mon–Sat: 9 AM – 8 PM' },
  emergencySupport: { type: String, default: '24×7 emergency support' },
  supportHours: { type: String, default: '24×7 for paid clients' },
  averageResponseTime: { type: String, default: '~22 minutes' },

  // Social links
  social: {
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    twitter: String, // Twitter / X
    github: String,
  },

  // Hero (homepage) — defaults match components/home/Hero.tsx's current live
  // copy exactly, so wiring this up doesn't silently change the homepage;
  // it only takes effect once an admin actually edits something here.
  heroEyebrow: { type: String, default: 'Enterprise Software, Engineered in India' },
  heroTitle: { type: String, default: 'Custom Software Development' },
  heroAccent: { type: String, default: 'Purpose-Built Software. Precision Engineered for Your Business.' },
  heroDescription: { type: String, default: 'Custom ERP, CRM, and AI automation built around how your business actually runs — so operations move faster, decisions are backed by real data, and nothing breaks when it matters most. Trusted by hospital networks, government bodies, and enterprises that cannot afford downtime.' },
  heroCtaText: { type: String, default: 'Talk to a Solution Architect' },
  heroCtaLink: { type: String, default: '/book-demo' },
  heroSecondaryCtaText: { type: String, default: 'See Live Case Studies' },
  heroSecondaryCtaLink: { type: String, default: '/software' },

  // Feature flags — toggle features on/off site-wide
  features: {
    chatbot: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    bookDemo: { type: Boolean, default: true },
    googleLogin: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    coupons: { type: Boolean, default: true },
    bookings: { type: Boolean, default: true },
    cookieConsent: { type: Boolean, default: true },
  },

  // SEO
  metaTitle: { type: String, default: 'KVL Business Solutions — India\'s Next-Generation Business Technology' },
  metaDescription: { type: String, default: 'Advanced Software, Industrial Solutions, GPS Systems & Modern Business Technology.' },

  // Maintenance mode
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'We\'re back in a few minutes. For urgent help, WhatsApp +91 99420 00413.' },

  // Referral program — the real reward policy, written by an admin. Left blank
  // by default; the referral pages show "no policy published yet" until an
  // admin fills this in with the actual, real terms (no invented amounts).
  referralRewardDescription: { type: String, default: '' },
}, { timestamps: true, _id: false });

export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);

// Cached settings to avoid hitting DB on every request
let cache: { data: any; ts: number } | null = null;
const TTL = 30_000; // 30 seconds

export async function getSiteSettings(): Promise<any> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    let doc = await SiteSettings.findById('main').lean();
    if (!doc) doc = await SiteSettings.create({ _id: 'main' });
    cache = { data: doc, ts: Date.now() };
    return doc;
  } catch (e) {
    console.error('getSiteSettings error', e);
    // Fallback to schema defaults if DB fails
    return new SiteSettings({ _id: 'main' }).toObject();
  }
}

export function invalidateSettingsCache() { cache = null; }
