import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';
import { Lead } from '@/lib/models/Lead';
import { rzp } from '@/lib/razorpay';
import { generateOrderId } from '@/lib/license';
import { getLiveSoftwareProduct } from '@/lib/data/live-software';
import { Coupon, evaluateCoupon } from '@/lib/models/Coupon';
import { fireTrigger } from '@/lib/workflows/runner';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const GST_RATE = 18;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    if (!rzp) return NextResponse.json({ ok: false, error: 'Razorpay not configured' }, { status: 500 });
    const session = await getServerSession(authOptions);

    const { productSlug, hosting = 'cloud', couponCode, guestEmail, guestPhone } = await req.json();

    // Payment happens before account creation — a logged-in session is no
    // longer required, but we still need somewhere to send the license key
    // and match the order up if this person registers later (see
    // app/checkout/success/page.tsx and dashboard/orders/[id], which looks
    // up orders by email). Guests are rate-limited since this path is now
    // reachable without auth.
    let identityEmail = session?.user?.email;
    let identityPhone: string | undefined;
    if (!identityEmail) {
      const limit = rateLimit(`guest-checkout:${clientIp(req)}`, 8, 10 * 60_000);
      if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts, please try again shortly' }, { status: 429 });
      if (!guestEmail || !EMAIL_RE.test(guestEmail)) return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
      if (!guestPhone || String(guestPhone).replace(/\D/g, '').length < 10) return NextResponse.json({ ok: false, error: 'A valid phone number is required' }, { status: 400 });
      identityEmail = String(guestEmail).toLowerCase().trim();
      identityPhone = String(guestPhone).trim();
    }

    const product = await getLiveSoftwareProduct(productSlug);
    if (!product) return NextResponse.json({ ok: false, error: 'Invalid product' }, { status: 400 });

    const mult = hosting === 'on-premise' ? 1.5 : 1;
    const baseSubtotal = Math.round(product.price * mult);

    await connectDB();

    // Apply coupon if present
    let discount = 0;
    let appliedCoupon: any = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase() });
      if (coupon) {
        const ev = evaluateCoupon(coupon.toObject(), { amount: baseSubtotal, productSlug });
        if (ev.ok) {
          discount = ev.discount!;
          appliedCoupon = coupon;
        }
      }
    }

    const subtotal = baseSubtotal - discount;
    const gstAmount = Math.round((subtotal * GST_RATE) / 100);
    const amount = subtotal + gstAmount;

    const orderId = generateOrderId();
    const rzpOrder = await rzp.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId,
      notes: { productSlug, email: identityEmail, hosting },
    });

    // Guests aren't logged in, but may already have an account from a past
    // order — link it if so (read-only lookup, does not sign them in).
    const u: any = await User.findOne({ email: identityEmail }).lean();
    const billing = u
      ? { name: u.name, email: u.email, phone: u.phone, company: u.company, gstin: u.gstin, address: u.address }
      : { email: identityEmail, phone: identityPhone };

    // Was this buyer previously a Lead (e.g. filled a form before coming
    // back to pay)? Link the most recent match so admin can trace ad/lead
    // sources through to actual revenue instead of two disconnected records.
    const emailRe = new RegExp(`^${identityEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const matchedLead: any = await Lead.findOne({
      $or: [{ email: emailRe }, ...(identityPhone ? [{ phone: identityPhone }] : [])],
    }).sort({ createdAt: -1 }).lean();

    await Order.create({
      orderId,
      email: identityEmail,
      user: u?._id,
      lead: matchedLead?._id,
      productSlug,
      productName: product.name,
      subtotal,
      gstAmount,
      gstRate: GST_RATE,
      amount,
      hosting,
      razorpayOrderId: rzpOrder.id,
      status: 'created',
      billing,
      couponCode: appliedCoupon?.code,
      discount,
    });

    // Increment coupon usage (only on order created — finalize on webhook would be more accurate but acceptable)
    if (appliedCoupon) {
      await Coupon.updateOne({ _id: appliedCoupon._id }, { $inc: { usedCount: 1 } });
    }

    fireTrigger('new_order', {
      name: u?.name || identityEmail,
      email: identityEmail,
      phone: u?.phone || identityPhone || '',
      amount,
      productName: product.name,
      orderId,
      hosting,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      razorpayOrderId: rzpOrder.id,
      amount: amount * 100,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      productName: product.name,
      breakdown: { baseSubtotal, discount, subtotal, gstAmount, gstRate: GST_RATE, total: amount, couponCode: appliedCoupon?.code },
    });
  } catch (e) {
    return apiError(e);
  }
}
