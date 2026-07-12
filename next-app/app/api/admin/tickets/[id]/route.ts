import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/lib/models/Ticket';
import { requireAdmin } from '@/lib/admin-guard';
import { sendNotification, ticketReplyEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  assignedTo: z.string().optional(),
  reply: z.string().min(1).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const { status, assignedTo, reply } = schema.parse(await req.json());
    await connectDB();

    const update: any = {};
    if (status) update.status = status;
    if (assignedTo !== undefined) update.assignedTo = assignedTo;
    if (reply) {
      update.$push = { replies: { message: reply, authorEmail: g.session?.user?.email, isAdmin: true } };
    }

    const { $push, ...setFields } = update;
    const ticket = await Ticket.findByIdAndUpdate(
      params.id,
      { ...(Object.keys(setFields).length ? { $set: setFields } : {}), ...($push ? { $push } : {}) },
      { new: true }
    );
    if (!ticket) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    // Reply actually emails the customer — this was previously entirely
    // unimplemented (admin could only view tickets, never respond).
    if (reply) {
      sendNotification(`Reply to your support ticket`, ticketReplyEmail(ticket, reply), ticket.email);
    }

    logActivity({
      action: reply ? 'ticket.reply' : 'ticket.update',
      actorEmail: g.session?.user?.email || undefined,
      actorRole: 'admin',
      target: 'Ticket',
      targetId: params.id,
      details: { status, hasReply: Boolean(reply) },
      req,
    });

    return NextResponse.json({ ok: true, ticket });
  } catch (e) {
    return apiError(e);
  }
}
