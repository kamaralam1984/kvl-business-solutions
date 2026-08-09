import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Quote } from '@/lib/models/Quote';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || '';
    const filter: any = {};
    if (q) filter.$or = [{ 'contact.name': { $regex: q, $options: 'i' } }, { 'contact.email': { $regex: q, $options: 'i' } }];
    if (status) filter.status = status;
    await connectDB();
    const quotes = await Quote.find(filter).sort({ createdAt: -1 }).limit(300).lean();
    const all = await Quote.find({}).lean();
    const stats = {
      total: all.length,
      submitted: all.filter((x: any) => x.status === 'submitted').length,
      followUp: all.filter((x: any) => x.status === 'follow-up').length,
      closed: all.filter((x: any) => x.status === 'closed').length,
      totalValue: all.reduce((s: number, x: any) => s + ((x.estimateLow || 0) + (x.estimateHigh || 0)) / 2, 0),
    };
    return NextResponse.json({ ok: true, quotes, stats });
  } catch (e) {
    return apiError(e);
  }
}
