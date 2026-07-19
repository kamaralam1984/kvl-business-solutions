import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Deal } from '@/lib/models/Deal';
import { requestReviewForDeal } from '@/lib/review-request';

// Manual trigger for the CRM "Request Review" button — covers deals that were
// already won before contactEmail was on file, or where the auto-send on the
// won/repeat stage transition needs re-sending.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const isAdmin = (session.user as any).role === 'admin';
  const filter = isAdmin ? { _id: params.id } : { _id: params.id, ownerEmail: session.user.email };
  const deal = await Deal.findOne(filter).lean<any>();
  if (!deal) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const result = await requestReviewForDeal(deal);
  if (!result.sent) return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
  return NextResponse.json({ ok: true });
}
