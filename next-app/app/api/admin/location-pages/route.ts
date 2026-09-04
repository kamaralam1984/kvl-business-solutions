import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { LocationPage } from '@/lib/models/LocationPage';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';
import { locationPageSchema as schema } from '@/lib/validation/location-pages';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const locations = await LocationPage.find({}).sort({ country: 1, name: 1 }).lean();
    return NextResponse.json({ ok: true, locations });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const loc = await LocationPage.create(data);
    logActivity({ action: 'location.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'LocationPage', targetId: loc._id.toString(), details: { name: data.name }, req });
    if (data.status === 'published') submitToIndexNow([`/${data.country}/${data.slug}`]);
    return NextResponse.json({ ok: true, location: loc });
  } catch (e) {
    return apiError(e);
  }
}
