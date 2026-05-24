import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const path = req.nextUrl.pathname;

    const isAdminUi = path.startsWith('/admin');
    const isAdminApi = path.startsWith('/api/admin');

    if ((isAdminUi || isAdminApi) && token?.role !== 'admin') {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/checkout/:path*',
  ],
};
