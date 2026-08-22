import Razorpay from 'razorpay';
import crypto from 'crypto';
import { timingSafeEqual } from './timing-safe-equal';

export const rzp = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  : null;

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  // Same guard as `rzp` above — without it a missing secret throws a cryptic
  // crypto error mid-checkout instead of a clear, identifiable message for
  // whoever's debugging a customer's "payment verification failed" report.
  if (!secret) throw new Error('Razorpay is not configured (RAZORPAY_KEY_SECRET missing).');
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return timingSafeEqual(expected, signature);
}
