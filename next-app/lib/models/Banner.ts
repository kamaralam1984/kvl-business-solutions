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

export async function getActiveBanner(): Promise<any | null> {
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
    return banner;
  } catch {
    return null;
  }
}
