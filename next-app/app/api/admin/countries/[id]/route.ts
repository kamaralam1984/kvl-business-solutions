import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Country } from '@/lib/models/Country';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { countrySchema } from '@/lib/validation/countries';

const updateSchema = countrySchema.partial();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const country = await Country.findByIdAndUpdate(params.id, data, { new: true });
    if (!country) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'country.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Country', targetId: params.id, details: { name: country.name }, req });
    return NextResponse.json({ ok: true, country });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Country.findByIdAndDelete(params.id);
  logActivity({ action: 'country.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Country', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
