import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/admin-guard';
import { initiateCall } from '@/lib/vapi';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const lead = await Lead.findById(params.id);
  if (!lead) return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404 });
  if (lead.callStatus === 'calling') return NextResponse.json({ ok: false, error: 'Call already in progress' }, { status: 400 });

  try {
    const { callId } = await initiateCall({
      name: lead.name,
      phone: lead.phone,
      service: lead.service,
      leadId: lead._id.toString(),
    });

    await Lead.findByIdAndUpdate(params.id, {
      callStatus: 'calling',
      callId,
      calledAt: new Date(),
    });

    return NextResponse.json({ ok: true, callId });
  } catch (e) {
    return apiError(e);
  }
}
