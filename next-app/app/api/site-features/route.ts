import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/models/SiteSettings';

// Public, unauthenticated — the client-side counterpart to Admin > Site
// Settings > Features, for the handful of pages (login/register's Google
// button, the review-submission form, checkout's coupon field) that are
// client components and can't read getSiteSettings() directly server-side.
// Same fail-open shape as maintenance-status: on any error, every feature
// defaults to enabled rather than silently hiding real functionality.
const DEFAULTS = { chatbot: true, bookDemo: true, googleLogin: true, reviews: true, coupons: true, bookings: true };

// Route handlers don't inherit a layout's `revalidate` — without this, Next.js
// statically optimizes this GET and freezes its response at build time, so a
// toggle flipped in the admin panel would never actually reach this endpoint.
export const revalidate = 30;

export async function GET() {
  try {
    const settings = await getSiteSettings().catch(() => null);
    return NextResponse.json({ ...DEFAULTS, ...(settings?.features || {}) });
  } catch (e) {
    console.error(e);
    return NextResponse.json(DEFAULTS);
  }
}
