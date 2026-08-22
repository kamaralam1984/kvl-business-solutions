'use client';
import { useEffect } from 'react';

// app/error.tsx only catches errors thrown while rendering a page inside the
// root layout — it can't catch an error thrown by app/layout.tsx itself
// (e.g. getSiteSettings()/getActiveBanner() failing). Without this file,
// that case falls through to Next.js's unstyled default crash screen for
// every visitor site-wide. This has to define its own <html>/<body> and
// can't assume ThemeProvider/SiteChrome ran, so it's plain inline styles —
// no Tailwind/theme-variable dependency — to guarantee it renders even if
// whatever broke the layout also broke CSS variable resolution.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
        <div style={{ maxWidth: 420, textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 32, background: 'rgba(255,255,255,0.03)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.7)', margin: '0 0 20px' }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(245,245,245,0.5)', margin: '0 0 20px' }}>Ref: {error.digest}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ background: '#c8a870', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{ background: 'transparent', color: '#f5f5f5', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
