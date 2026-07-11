import { NextResponse } from 'next/server';

// IndexNow requires a key file at https://{domain}/{key}.txt whose body is the
// key itself. A next.config.js rewrite maps that external URL shape to this
// internal API route (kept under /api/, which robots.txt already disallows,
// so it never competes with real page routing or the site's 404 handling).
// The key is issued by generating one at bing.com/indexnow (or any
// IndexNow-compatible tool) and setting INDEXNOW_KEY in the environment — this
// route only serves the file once that's configured; it 404s otherwise.
export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const key = process.env.INDEXNOW_KEY;

  if (!key || params.key !== key) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
