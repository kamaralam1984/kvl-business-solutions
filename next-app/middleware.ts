import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req, event) {
    const token = req.nextauth.token as any;
    const path = req.nextUrl.pathname;

    // ── Existing admin-gating logic (unchanged) ─────────────────────────────
    const isAdminUi = path.startsWith('/admin');
    const isAdminApi = path.startsWith('/api/admin');

    if ((isAdminUi || isAdminApi) && token?.role !== 'admin') {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // ── Referral link capture (additive — task 14) ──────────────────────────
    // Captures ?ref=<code> on any page landing and stores it in a cookie for
    // ~30 days so a later Lead submission (app/api/lead/route.ts) can be
    // attributed to the referrer. Also pings /api/referral/click, fire-and-
    // forget via event.waitUntil (mongoose can't run in this edge runtime, so
    // the real DB increment happens in that Node.js route, not here), to
    // record a real click against the code. Entirely independent of the
    // auth-gating block above — it never returns early from that block, and
    // it doesn't touch `token` or the admin checks.
    const ref = req.nextUrl.searchParams.get('ref');
    if (ref && /^[A-Za-z0-9]{4,20}$/.test(ref)) {
      const res = NextResponse.next();
      res.cookies.set('kvl_ref', ref, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'lax',
      });
      event.waitUntil(
        fetch(new URL('/api/referral/click', req.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: ref }),
        }).catch(() => {})
      );
      return res;
    }
  },
  {
    callbacks: {
      // Same gating outcome as before for the routes that used to be the only
      // ones matched (dashboard/admin/checkout: requires a token). The matcher
      // below now also runs this middleware on public pages so referral links
      // can be captured there — `authorized` must return true for those, or
      // withAuth would redirect anonymous visitors to /login.
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const protectedPath =
          path.startsWith('/dashboard') ||
          path.startsWith('/admin') ||
          path.startsWith('/api/admin') ||
          path.startsWith('/checkout');
        return protectedPath ? !!token : true;
      },
    },
    pages: { signIn: '/login' },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/checkout/:path*',
    // Referral capture needs to run on ordinary landing pages too — everything
    // except static assets, Next internals, and API routes (which are already
    // covered explicitly above where needed).
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
