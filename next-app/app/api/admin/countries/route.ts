import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Country } from '@/lib/models/Country';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { countrySchema as schema } from '@/lib/validation/countries';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const countries = await Country.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ ok: true, countries });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const country = await Country.create(data);
    logActivity({ action: 'country.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Country', targetId: country._id.toString(), details: { name: data.name }, req });
    return NextResponse.json({ ok: true, country });
  } catch (e) {
    return apiError(e);
  }
}
