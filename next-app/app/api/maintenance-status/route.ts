import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/models/SiteSettings';

// Public, unauthenticated — read by middleware.ts (edge runtime, can't use
// mongoose directly) to decide whether to block non-admin visitors.
//
// Route handlers don't inherit a layout's `revalidate` — without declaring
// this here too, Next.js statically optimizes this GET (nothing in it uses
// a dynamic API) and freezes its response at build time. Turning maintenance
// mode on/off from the admin panel would then silently have no effect on
// this endpoint until the next deploy, defeating the entire feature.
export const revalidate = 30;

export async function GET() {
  try {
    const settings = await getSiteSettings().catch(() => null);
    return NextResponse.json({ maintenanceMode: Boolean(settings?.maintenanceMode) });
  } catch (e) {
    // middleware.ts already fails open around this call (a broken status
    // check must never take the whole site down) — this just ensures the
    // failure it catches is a clean JSON response, not a raw 500 that would
    // throw a SyntaxError out of `await statusRes.json()`.
    console.error(e);
    return NextResponse.json({ maintenanceMode: false });
  }
}
