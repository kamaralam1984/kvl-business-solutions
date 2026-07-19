import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Deal, DEAL_STAGES } from '@/lib/models/Deal';
import { chatRouted } from '@/lib/ai/router';
import { fireTrigger } from '@/lib/workflows/runner';
import { requestReviewForDeal } from '@/lib/review-request';

const schema = z.object({
  title: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  value: z.number().nonnegative().optional(),
  stage: z.enum(DEAL_STAGES).optional(),
  probability: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    // Admins can edit any deal (matches the "see the whole pipeline" behavior
    // in GET above); regular users are still scoped to their own deals.
    const isAdmin = (session.user as any).role === 'admin';
    const filter = isAdmin ? { _id: params.id } : { _id: params.id, ownerEmail: session.user.email };
    const before: any = data.stage ? await Deal.findOne(filter).lean() : null;
    const d = await Deal.findOneAndUpdate(filter, { $set: data }, { new: true });
    if (!d) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    // --- Workflow trigger firing (additive, task 13) ---
    // Fires only when `stage` was actually part of this update and changed value.
    if (data.stage && before && before.stage !== data.stage) {
      const ctx = {
        dealId: d._id.toString(), title: d.title, name: d.contactName, email: undefined,
        amount: d.value, stage: d.stage, ownerEmail: d.ownerEmail, source: d.source,
      };
      if (data.stage === 'won' || data.stage === 'repeat') {
        fireTrigger('deal_won', ctx);
        requestReviewForDeal(d).catch(e => console.error('[review-request]', e));
      }
      else if (data.stage === 'lost') fireTrigger('deal_lost', ctx);
      else if (data.stage === 'proposal') fireTrigger('proposal_sent', ctx);
    }
    // --- end additive block ---

    return NextResponse.json({ ok: true, deal: d });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const isAdmin = (session.user as any).role === 'admin';
  const filter = isAdmin ? { _id: params.id } : { _id: params.id, ownerEmail: session.user.email };
  await Deal.findOneAndDelete(filter);
  return NextResponse.json({ ok: true });
}

// AI suggest next action
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const isAdmin = (session.user as any).role === 'admin';
  const filter = isAdmin ? { _id: params.id } : { _id: params.id, ownerEmail: session.user.email };
  const d: any = await Deal.findOne(filter).lean();
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
