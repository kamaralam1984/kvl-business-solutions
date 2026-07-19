import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { sendNotification } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { linkVisitorToLead } from '@/lib/vip/link';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().optional(),
  product: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`booking:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const b = await Booking.create({
      ...data,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
    });

    const html = `<h2>New Demo Booking</h2>
      <p><b>${data.name}</b> (${data.email}, ${data.phone}) from <b>${data.company || '—'}</b></p>
      <p>Product: ${data.product || 'General'}<br/>
      Preferred: ${data.preferredDate || 'flexible'} ${data.preferredTime || ''}</p>
      <p>${data.notes || ''}</p>`;
    sendNotification(`📅 Demo booking — ${data.name}`, html);
    sendNotification(`We received your demo booking — KVL`,
      `<h2>Hi ${data.name}!</h2>
       <p>Thanks for booking a demo. Our team will confirm a slot within <b>2 business hours</b> and email you the meeting link.</p>
       <p>Need to chat sooner? WhatsApp <a href="https://wa.me/919942000413">+91 99420 00413</a>.</p>`,
      data.email);

    linkVisitorToLead({ name: data.name, email: data.email }).catch(() => {});
    return NextResponse.json({ ok: true, id: b._id });
  } catch (e) {
    return apiError(e);
  }
}
