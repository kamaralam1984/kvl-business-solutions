import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { SiteSettings, invalidateSettingsCache } from '@/lib/models/SiteSettings';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    let doc = await SiteSettings.findById('main').lean();
    if (!doc) doc = await SiteSettings.create({ _id: 'main' });
    return NextResponse.json({ ok: true, settings: doc });
  } catch (e) {
    return apiError(e);
  }
}

export async function PUT(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = await req.json();
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    await connectDB();
    const updated = await SiteSettings.findByIdAndUpdate('main', { $set: data }, { new: true, upsert: true });
    invalidateSettingsCache();
    logActivity({
      action: 'settings.update',
      actorEmail: g.session?.user?.email || undefined,
      actorRole: 'admin',
      target: 'SiteSettings',
      details: { fields: Object.keys(data) },
      req,
    });
    return NextResponse.json({ ok: true, settings: updated });
  } catch (e) {
    return apiError(e);
  }
}
