import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';
import { rzp } from '@/lib/razorpay';
import { generateOrderId } from '@/lib/license';
import { getLiveSoftwareProduct } from '@/lib/data/live-software';
import { Coupon, evaluateCoupon } from '@/lib/models/Coupon';
import { fireTrigger } from '@/lib/workflows/runner';

const GST_RATE = 18;

export async function POST(req: Request) {
  try {
    if (!rzp) return NextResponse.json({ ok: false, error: 'Razorpay not configured' }, { status: 500 });
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 });

    const { productSlug, hosting = 'cloud', couponCode } = await req.json();
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
      notes: { productSlug, email: session.user.email, hosting },
    });

    const u: any = await User.findOne({ email: session.user.email }).lean();
    const billing = u ? {
      name: u.name, email: u.email, phone: u.phone, company: u.company, gstin: u.gstin, address: u.address,
    } : { email: session.user.email };

    await Order.create({
      orderId,
      email: session.user.email,
      user: u?._id,
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
      name: u?.name || session.user.email,
      email: session.user.email,
      phone: u?.phone || '',
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
