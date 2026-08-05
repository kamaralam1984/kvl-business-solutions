import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const subscriber = await Subscriber.findByIdAndDelete(params.id);
  logActivity({ action: 'subscriber.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Subscriber', targetId: subscriber?.email, req });
  return NextResponse.json({ ok: true });
}
