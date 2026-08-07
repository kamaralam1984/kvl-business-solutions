import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req, event) {
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

    // ── Maintenance mode ─────────────────────────────────────────────────────
    // Site Settings' "Maintenance Mode" toggle previously only changed an SEO
    // robots tag — it never actually blocked visitors. This runs on the edge
    // runtime (can't use mongoose directly), so it reads the flag via a small
    // cached fetch to a Node.js route instead. Admins always pass through so
    // they can turn it back off. Skipped for admin/API/auth routes, which
    // have their own gating (or must stay reachable to manage the toggle).
    if (!isAdminUi && !isAdminApi && !path.startsWith('/api/') && path !== '/login') {
      try {
        const statusRes = await fetch(new URL('/api/maintenance-status', req.url), {
          next: { revalidate: 30 },
        });
        const { maintenanceMode } = await statusRes.json();
        if (maintenanceMode && token?.role !== 'admin') {
          return new NextResponse(
            `<!DOCTYPE html><html><head><title>Under Maintenance — KVL Business Solutions</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:20px"><div><h1 style="color:#c8a870;font-size:28px;margin-bottom:12px">We'll be right back</h1><p style="color:rgba(255,255,255,0.6);max-width:420px;margin:0 auto">KVL Business Solutions is undergoing scheduled maintenance. Please check back shortly.</p></div></body></html>`,
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '300' } }
          );
        }
      } catch {
        // Fail open — a broken status check must never take the whole site down.
      }
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
        // /checkout is intentionally NOT gated here — payment happens before
        // account creation (guest checkout), so an anonymous visitor must be
        // able to reach it. Guest identity is collected on the page itself
        // and enforced server-side in /api/payments/create-order instead.
        const protectedPath =
          path.startsWith('/dashboard') ||
          path.startsWith('/admin') ||
          path.startsWith('/api/admin');
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
    // /checkout is covered by the catch-all below (still needs referral-capture
    // and maintenance-mode handling), just no longer auth-gated — see `authorized`.
    // Referral capture needs to run on ordinary landing pages too — everything
    // except static assets, Next internals, and API routes (which are already
    // covered explicitly above where needed).
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
