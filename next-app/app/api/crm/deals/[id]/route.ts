import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Deal, DEAL_STAGES } from '@/lib/models/Deal';
import { chatRouted } from '@/lib/ai/router';

const schema = z.object({
  title: z.string().optional(),
  contactName: z.string().optional(),
  value: z.number().nonnegative().optional(),
  stage: z.enum(DEAL_STAGES).optional(),
  probability: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const d = await Deal.findOneAndUpdate({ _id: params.id, ownerEmail: session.user.email }, { $set: data }, { new: true });
    if (!d) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, deal: d });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  await Deal.findOneAndDelete({ _id: params.id, ownerEmail: session.user.email });
  return NextResponse.json({ ok: true });
}

// AI suggest next action
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const d: any = await Deal.findOne({ _id: params.id, ownerEmail: session.user.email }).lean();
  if (!d) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const sys = `You are a smart sales coach. Given a deal in the pipeline, suggest the BEST next action in 1-2 sentences. Be specific and actionable.`;
  const userPrompt = `Deal: ${d.title}\nContact: ${d.contactName || 'unknown'}\nValue: ₹${d.value}\nStage: ${d.stage} (${d.probability}% probability)\nLast action: ${d.lastAction || 'none yet'}\nNotes: ${d.notes || 'none'}\n\nWhat should this salesperson do next? Be brief & specific.`;

  const result = await chatRouted({
    messages: [{ role: 'user', content: userPrompt }],
    system: sys,
    maxTokens: 150,
    cacheKey: `deal-suggest:${d.stage}:${d.title.slice(0, 30)}`,
  });

  await Deal.updateOne({ _id: params.id }, { $set: { aiSuggestion: result.reply } });
  return NextResponse.json({ ok: true, suggestion: result.reply, provider: result.provider });
}
