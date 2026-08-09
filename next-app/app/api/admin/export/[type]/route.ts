import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { Lead } from '@/lib/models/Lead';
import { User } from '@/lib/models/User';
import { Ticket } from '@/lib/models/Ticket';
import { Quote } from '@/lib/models/Quote';
import { Subscriber } from '@/lib/models/Subscriber';
import { requireAdmin } from '@/lib/admin-guard';
import { toCSV } from '@/lib/csv';

const date = (d: any) => d ? new Date(d).toISOString() : '';

export async function GET(_: Request, { params }: { params: { type: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
  await connectDB();

  let rows: Record<string, any>[] = [];
  let filename = `kvl-${params.type}-${new Date().toISOString().slice(0, 10)}.csv`;

  switch (params.type) {
    case 'orders': {
      const data = await Order.find({}).sort({ createdAt: -1 }).lean();
      rows = data.map((o: any) => ({
        orderId: o.orderId,
        invoiceNo: o.invoiceNo || '',
        date: date(o.createdAt),
        email: o.email,
        billingName: o.billing?.name || '',
        company: o.billing?.company || '',
        gstin: o.billing?.gstin || '',
        product: o.productName,
        productSlug: o.productSlug,
        hosting: o.hosting,
        subtotal: o.subtotal || '',
        gstAmount: o.gstAmount || '',
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        razorpayOrderId: o.razorpayOrderId || '',
        razorpayPaymentId: o.razorpayPaymentId || '',
        licenseKey: o.licenseKey || '',
      }));
      break;
    }
    case 'leads': {
      const data = await Lead.find({}).sort({ createdAt: -1 }).lean();
      rows = data.map((l: any) => ({
        date: date(l.createdAt),
        name: l.name, email: l.email, phone: l.phone,
        companyName: l.companyName || '', businessType: l.businessType || '',
        service: l.service || '', message: l.message || '', source: l.source || '',
        status: l.status || '',
      }));
      break;
    }
    case 'users': {
      const data = await User.find({}).select('-passwordHash -verifyToken -resetToken').sort({ createdAt: -1 }).lean();
      rows = data.map((u: any) => ({
        date: date(u.createdAt),
        email: u.email, name: u.name || '', phone: u.phone || '',
        company: u.company || '', gstin: u.gstin || '',
        role: u.role, emailVerified: u.emailVerified ? 'yes' : 'no',
        city: u.address?.city || '', state: u.address?.state || '',
      }));
      break;
    }
    case 'tickets': {
      const data = await Ticket.find({}).sort({ createdAt: -1 }).lean();
      rows = data.map((t: any) => ({
        date: date(t.createdAt),
        name: t.name, email: t.email,
        product: t.product || '', priority: t.priority,
        description: t.description, status: t.status || 'open',
      }));
      break;
    }
    case 'quotes': {
      const data = await Quote.find({}).sort({ createdAt: -1 }).lean();
      rows = data.map((q: any) => ({
        date: date(q.createdAt),
        type: q.type, scope: q.scope, timeline: q.timeline,
        estimateLow: q.estimateLow, estimateHigh: q.estimateHigh,
        contactName: q.contact?.name, contactEmail: q.contact?.email, contactPhone: q.contact?.phone,
      }));
      break;
    }
    case 'subscribers': {
      const data = await Subscriber.find({}).sort({ createdAt: -1 }).lean();
      rows = data.map((s: any) => ({
        date: date(s.createdAt),
        email: s.email, source: s.source, active: s.active ? 'yes' : 'no',
        unsubscribedAt: date(s.unsubscribedAt),
      }));
      break;
    }
    default:
      return NextResponse.json({ ok: false, error: 'Invalid export type' }, { status: 400 });
  }

  const csv = toCSV(rows);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
  } catch (e) {
    return apiError(e);
  }
}
