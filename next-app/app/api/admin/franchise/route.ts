import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Franchise } from '@/lib/models/Franchise';
import { Lead } from '@/lib/models/Lead';
import { Order } from '@/lib/models/Order';
import { getOrCreateReferral } from '@/lib/referrals';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  ownerEmail: z.string().email(),
  name: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  startDate: z.string().optional(),
  status: z.enum(['active', 'paused', 'closed']).default('active'),
  monthlyTarget: z.number().int().nonnegative().default(100000),
  commissionRate: z.number().min(0).max(100).default(10),
});

// Each franchise partner is attributed via the same referral-code mechanism
// the standalone referral program uses (lib/referrals.ts) — one code per
// email, get-or-create on first read. This list computes real revenue per
// partner from that attribution, not just the raw Franchise document.
export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const franchises = await Franchise.find({}).sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(franchises.map(async (f: any) => {
      const referral = await getOrCreateReferral(f.ownerEmail);
      const leads = await Lead.find({ referralCode: referral.code }, { _id: 1 }).lean();
      const leadIds = leads.map((l: any) => l._id);
      const orders = await Order.find({ status: 'paid', lead: { $in: leadIds } }, { amount: 1 }).lean();
      const revenue = orders.reduce((s: number, o: any) => s + (o.amount || 0), 0);
      return {
        ...f,
        referralCode: referral.code,
        leadsCount: leads.length,
        ordersCount: orders.length,
        revenue,
        commission: Math.round(revenue * (f.commissionRate / 100)),
      };
    }));

    return NextResponse.json({ ok: true, franchises: enriched });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const f = await Franchise.create({ ...data, ownerEmail: data.ownerEmail.toLowerCase() });
    // Provision their referral link immediately so it's ready to hand over.
    const referral = await getOrCreateReferral(f.ownerEmail);
    logActivity({ action: 'franchise.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Franchise', targetId: f._id.toString(), details: { name: f.name, ownerEmail: f.ownerEmail }, req });
    return NextResponse.json({ ok: true, franchise: { ...f.toObject(), referralCode: referral.code } });
  } catch (e) {
    return apiError(e);
  }
}
