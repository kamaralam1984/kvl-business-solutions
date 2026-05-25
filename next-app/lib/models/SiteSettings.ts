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
  email: { type: String, default: 'info@kvlsolutions.in' },
  supportEmail: { type: String, default: 'support@kvlsolutions.in' },
  salesEmail: { type: String, default: 'sales@kvlsolutions.in' },
  whatsapp: { type: String, default: '919942000413' },
  whatsappSupportText: { type: String, default: '24×7 support' },
  addressLine1: { type: String, default: 'Pune, Maharashtra, India' },
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
    twitter: String,
  },

  // Hero (homepage)
  heroEyebrow: { type: String, default: 'BUSINESS TECHNOLOGY' },
  heroTitle: { type: String, default: 'Smart Software,' },
  heroAccent: { type: String, default: 'Powerful Business' },
  heroDescription: { type: String, default: 'Advanced software, GPS, automation, and enterprise services — one trusted partner for 1000+ Indian businesses.' },
  heroCtaText: { type: String, default: 'Get A Quote' },
  heroCtaLink: { type: String, default: '/contact' },
  heroSecondaryCtaText: { type: String, default: 'Browse Software' },
  heroSecondaryCtaLink: { type: String, default: '/software' },

  // Stats (homepage)
  stats: {
    customers: { type: String, default: '1000+' },
    projects: { type: String, default: '500+' },
    rating: { type: String, default: '4.8' },
    uptime: { type: String, default: '99.5%' },
  },

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

  // Featured products on homepage (slugs)
  featuredProductSlugs: { type: [String], default: ['erp', 'gps-tracking', 'crm', 'school', 'hospital', 'ai-business'] },

  // Maintenance mode
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'We\'re back in a few minutes. For urgent help, WhatsApp +91 99420 00413.' },
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
