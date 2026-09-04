import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { LocationPage } from '@/lib/models/LocationPage';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';
import { locationPageSchema } from '@/lib/validation/location-pages';

const updateSchema = locationPageSchema.partial();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const location = await LocationPage.findById(params.id).lean();
    if (!location) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, location });
  } catch (e) {
    return apiError(e);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const location = await LocationPage.findByIdAndUpdate(params.id, data, { new: true });
    if (!location) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'location.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'LocationPage', targetId: params.id, details: { name: location.name }, req });
    if (location.status === 'published') submitToIndexNow([`/${location.country}/${location.slug}`]);
    return NextResponse.json({ ok: true, location });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await LocationPage.findByIdAndDelete(params.id);
  logActivity({ action: 'location.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'LocationPage', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
