import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Deal, DEAL_STAGES } from '@/lib/models/Deal';

const schema = z.object({
  title: z.string().min(2),
  contactName: z.string().optional(),
  value: z.number().nonnegative().default(0),
  stage: z.enum(DEAL_STAGES).default('lead'),
  probability: z.number().min(0).max(100).default(20),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  // Admins can see (and filter/export) the whole pipeline across owners; regular users
  // still only see their own deals — same behavior as before for non-admins.
  const isAdmin = (session.user as any).role === 'admin';
  const filter = isAdmin ? {} : { ownerEmail: session.user.email };
  const deals = await Deal.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, deals });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const d = await Deal.create({ ...data, ownerEmail: session.user.email });
    return NextResponse.json({ ok: true, deal: d });
  } catch (e) {
    return apiError(e);
  }
}
