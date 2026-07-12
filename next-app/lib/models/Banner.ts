import { Schema, models, model } from 'mongoose';

const BannerSchema = new Schema({
  text: { type: String, required: true },
  link: String,
  linkText: { type: String, default: 'Learn more' },
  active: { type: Boolean, default: true, index: true },
  variant: { type: String, enum: ['info', 'success', 'warning', 'promo'], default: 'promo' },
  dismissible: { type: Boolean, default: true },
  startsAt: Date,
  endsAt: Date,
}, { timestamps: true });

export const Banner = models.Banner || model('Banner', BannerSchema);

// Cached like getSiteSettings() — this is read on every page via the root
// layout, so an uncached DB hit here runs on every single request.
let cache: { data: any; ts: number } | null = null;
const TTL = 30_000;

export async function getActiveBanner(): Promise<any | null> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    const now = new Date();
    const banner = await Banner.findOne({
      active: true,
      $and: [
        { $or: [{ startsAt: { $lte: now } }, { startsAt: null }, { startsAt: { $exists: false } }] },
        { $or: [{ endsAt: { $gte: now } }, { endsAt: null }, { endsAt: { $exists: false } }] },
      ],
    }).sort({ createdAt: -1 }).lean();
    // Serialize to a plain object — the lean doc's _id is an ObjectId (has a
    // toJSON method), which React rejects when passed as a prop into the
    // client-component tree below (SiteChrome).
    const data = banner ? JSON.parse(JSON.stringify(banner)) : null;
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

export function invalidateBannerCache() { cache = null; }
