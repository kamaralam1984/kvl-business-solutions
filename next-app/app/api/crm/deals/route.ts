import { NextResponse } from 'next/server';
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
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const deals = await Deal.find({ ownerEmail: session.user.email }).sort({ createdAt: -1 }).lean();
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
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
