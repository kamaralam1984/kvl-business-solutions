import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/lib/models/Ticket';
import { requireAdmin } from '@/lib/admin-guard';
import { sendNotification, ticketReplyEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';
import { fireTrigger } from '@/lib/workflows/runner';

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

    const before: any = status ? await Ticket.findById(params.id).lean() : null;
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

    // Fires only on the actual open→closed transition, not every save while
    // already closed — same one-shot pattern as the Deal stage-change triggers.
    if (status === 'closed' && before && before.status !== 'closed') {
      fireTrigger('support_closed', {
        name: ticket.name, email: ticket.email, product: ticket.product, ticketId: ticket._id.toString(),
      });
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const ticket = await Ticket.findByIdAndDelete(params.id);
  logActivity({ action: 'ticket.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Ticket', targetId: ticket?.email, req });
  return NextResponse.json({ ok: true });
}
