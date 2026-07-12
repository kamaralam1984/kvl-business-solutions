import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/models/SiteSettings';

// Public, unauthenticated — read by middleware.ts (edge runtime, can't use
// mongoose directly) to decide whether to block non-admin visitors.
export async function GET() {
  const settings = await getSiteSettings().catch(() => null);
  return NextResponse.json({ maintenanceMode: Boolean(settings?.maintenanceMode) });
}
