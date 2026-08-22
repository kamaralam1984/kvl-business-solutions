import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Demo } from '@/lib/models/Demo';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { DEFAULT_DEMOS } from '@/lib/data/default-demos';

// Manual seed — adds default demos that don't already exist (by name)
export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();

    const existing = await Demo.find({}, { name: 1 }).lean();
    const existingNames = new Set(existing.map((d: any) => d.name.toLowerCase()));

    const toInsert = DEFAULT_DEMOS.filter(d => !existingNames.has(d.name.toLowerCase()));
    if (toInsert.length > 0) {
      await Demo.insertMany(toInsert);
    }

    logActivity({
      action: 'demo.seed',
      actorEmail: g.session?.user?.email || undefined,
      actorRole: 'admin',
      target: 'Demo',
      details: { added: toInsert.length, skipped: DEFAULT_DEMOS.length - toInsert.length, reason: 'manual seed' },
      req,
    });

    return NextResponse.json({
      ok: true,
      added: toInsert.length,
      skipped: DEFAULT_DEMOS.length - toInsert.length,
    });
  } catch (e) {
    return apiError(e);
  }
}
