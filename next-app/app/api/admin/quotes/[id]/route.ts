import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Quote } from '@/lib/models/Quote';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const quote = await Quote.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  if (!quote) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  logActivity({ action: 'quote.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Quote', targetId: quote.contact?.email, details: data, req });
  return NextResponse.json({ ok: true, quote });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const quote = await Quote.findByIdAndDelete(params.id);
  logActivity({ action: 'quote.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Quote', targetId: quote?.contact?.email, req });
  return NextResponse.json({ ok: true });
}
