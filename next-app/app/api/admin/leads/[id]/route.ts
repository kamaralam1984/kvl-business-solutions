import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const lead = await Lead.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  if (!lead) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  logActivity({ action: 'lead.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Lead', targetId: lead.email, details: data, req });
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const lead = await Lead.findByIdAndDelete(params.id);
  logActivity({ action: 'lead.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Lead', targetId: lead?.email, req });
  return NextResponse.json({ ok: true });
}
