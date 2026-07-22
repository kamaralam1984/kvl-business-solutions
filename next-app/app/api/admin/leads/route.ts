import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const status = url.searchParams.get('status') || '';
  const intent = url.searchParams.get('intent') || '';
  const filter: any = {};
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }];
  if (status) filter.status = status;
  if (intent) filter.intent = intent;
  await connectDB();
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(300).lean();
  const stats = {
    total: await Lead.countDocuments(),
    new: await Lead.countDocuments({ status: 'new' }),
    hot: await Lead.countDocuments({ intent: 'hot' }),
    contacted: await Lead.countDocuments({ status: { $in: ['contacted', 'qualified'] } }),
    won: await Lead.countDocuments({ status: 'won' }),
    lost: await Lead.countDocuments({ status: 'lost' }),
  };
  return NextResponse.json({ ok: true, leads, stats });
}
