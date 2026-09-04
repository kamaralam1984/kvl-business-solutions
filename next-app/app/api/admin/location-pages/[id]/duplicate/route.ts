import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { LocationPage } from '@/lib/models/LocationPage';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const source = await LocationPage.findById(params.id).lean() as any;
    if (!source) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    const { _id, createdAt, updatedAt, __v, ...rest } = source;

    let slug = `${source.slug}-copy`;
    let n = 2;
    while (await LocationPage.exists({ country: source.country, slug })) {
      slug = `${source.slug}-copy-${n}`;
      n += 1;
    }

    const clone = await LocationPage.create({
      ...rest,
      name: `${source.name} (Copy)`,
      slug,
      status: 'draft',
    });
    logActivity({ action: 'location.duplicate', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'LocationPage', targetId: clone._id.toString(), details: { from: params.id, name: clone.name }, req });
    return NextResponse.json({ ok: true, location: clone });
  } catch (e) {
    return apiError(e);
  }
}
