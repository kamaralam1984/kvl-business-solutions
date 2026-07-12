import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { INTEGRATION_GROUPS } from '@/lib/integrations-status';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;

  const groups = INTEGRATION_GROUPS.map(group => ({
    category: group.category,
    items: group.keys.map(({ key, label }) => ({
      key,
      label,
      configured: Boolean(process.env[key]?.trim()),
    })),
  }));

  const allKeys = groups.flatMap(g => g.items);
  const configuredCount = allKeys.filter(i => i.configured).length;

  return NextResponse.json({ ok: true, groups, total: allKeys.length, configuredCount });
}
