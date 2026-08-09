import { Order } from '@/lib/models/Order';
import { Coupon } from '@/lib/models/Coupon';
import { generateLicenseKey } from '@/lib/license';
import { sendNotification, orderEmail } from '@/lib/email';
import { notify } from '@/lib/models/Notification';
import { fireTrigger } from '@/lib/workflows/runner';

// Payment success is reachable from two independent, unordered paths —
// the browser's Razorpay handler calling /api/payments/verify, and
// Razorpay's payment.captured webhook — that can both land for the same
// order within milliseconds of each other. This is the single place that
// transition happens, gated by an atomic findOneAndUpdate on
// `status: { $ne: 'paid' }` so exactly one caller "wins" the race: only the
// winner regenerates the license key, sends the confirmation emails, fires
// the order_paid workflow trigger, and counts the coupon usage. The loser
// gets back the same already-paid order (idempotent, not an error).
export async function markOrderPaid(
  razorpayOrderId: string,
  opts: { razorpayPaymentId: string; razorpaySignature?: string }
): Promise<{ order: any; wasFirst: boolean }> {
  const existing = await Order.findOne({ razorpayOrderId });
  if (!existing) return { order: null, wasFirst: false };
  if (existing.status === 'paid') return { order: existing, wasFirst: false };

  const updated = await Order.findOneAndUpdate(
    { razorpayOrderId, status: { $ne: 'paid' } },
    {
      $set: {
        razorpayPaymentId: opts.razorpayPaymentId,
        ...(opts.razorpaySignature ? { razorpaySignature: opts.razorpaySignature } : {}),
        status: 'paid',
        licenseKey: generateLicenseKey(),
      },
    },
    { new: true }
  );

  if (!updated) {
    // Lost the race — the other path already flipped it between our read and write.
    const current = await Order.findOne({ razorpayOrderId });
    return { order: current, wasFirst: false };
  }

  if (updated.couponCode) {
    // Coupon usage is counted here — at confirmed payment — not at order
    // creation, so a checkout that's started and abandoned never burns a
    // limited-use code.
    await Coupon.updateOne({ code: updated.couponCode }, { $inc: { usedCount: 1 } }).catch(() => {});
  }

  sendNotification(`Your KVL License — ${updated.productName}`, orderEmail(updated), updated.email);
  sendNotification(`💰 New Paid Order — ${updated.productName}`, orderEmail(updated));
  notify(updated.email, {
    type: 'order',
    title: `Order paid · ${updated.productName}`,
    message: `Your license key is ready. Click to view order details and download invoice.`,
    link: `/dashboard/orders/${updated.orderId}`,
  });
  fireTrigger('order_paid', {
    name: updated.billing?.name || updated.email,
    email: updated.email,
    phone: updated.billing?.phone || '',
    amount: updated.amount,
    productName: updated.productName,
    orderId: updated.orderId,
    licenseKey: updated.licenseKey,
    link: `/dashboard/orders/${updated.orderId}`,
  });

  return { order: updated, wasFirst: true };
}
