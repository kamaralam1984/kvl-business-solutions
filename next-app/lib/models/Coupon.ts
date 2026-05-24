import { Schema, models, model } from 'mongoose';

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  description: String,
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true }, // percent: 1-100, fixed: INR
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: Number, // cap for percent coupons
  maxUses: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  productSlugs: { type: [String], default: [] }, // empty = all products
  validFrom: { type: Date, default: () => new Date() },
  validUntil: Date,
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export const Coupon = models.Coupon || model('Coupon', CouponSchema);

export function evaluateCoupon(coupon: any, opts: { amount: number; productSlug: string }) {
  if (!coupon.active) return { ok: false, error: 'Coupon is inactive' };
  const now = new Date();
  if (coupon.validFrom && now < new Date(coupon.validFrom)) return { ok: false, error: 'Coupon not yet active' };
  if (coupon.validUntil && now > new Date(coupon.validUntil)) return { ok: false, error: 'Coupon expired' };
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return { ok: false, error: 'Coupon usage limit reached' };
  if (opts.amount < (coupon.minOrderAmount || 0)) return { ok: false, error: `Min order amount ₹${coupon.minOrderAmount}` };
  if (coupon.productSlugs?.length > 0 && !coupon.productSlugs.includes(opts.productSlug)) return { ok: false, error: 'Coupon not valid for this product' };

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round((opts.amount * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
  } else {
    discount = Math.min(coupon.value, opts.amount);
  }
  return { ok: true, discount };
}
