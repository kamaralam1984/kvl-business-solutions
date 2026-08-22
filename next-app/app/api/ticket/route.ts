import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/lib/models/Ticket';
import { sendNotification, ticketEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { notify } from '@/lib/models/Notification';
import { fireTrigger } from '@/lib/workflows/runner';

const attachmentSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  name: z.string(),
  size: z.number(),
  format: z.string().optional(),
});

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  product: z.string().optional(),
  priority: z.enum(['low','medium','high','critical']).default('medium'),
  description: z.string().min(5),
  attachments: z.array(attachmentSchema).max(10).optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`ticket:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many tickets, try again later' }, { status: 429 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const t = await Ticket.create(data);
    sendNotification(`New Ticket [${data.priority.toUpperCase()}] — ${data.name}`, ticketEmail(data));
    notify(data.email, {
      type: 'ticket',
      title: `Ticket received [${data.priority.toUpperCase()}]`,
      message: `We got your request and will respond within 1 hour.`,
      link: '/support',
    });
    fireTrigger('new_ticket', {
      name: data.name, email: data.email, phone: '', priority: data.priority,
      product: data.product, description: data.description, ticketId: t._id.toString(),
    });
    return NextResponse.json({ ok: true, id: t._id });
  } catch (e) {
    return apiError(e);
  }
}
