'use client';
import dynamic from 'next/dynamic';

// Chat bubble, WhatsApp button, cookie banner — pure UI chrome, no SEO value,
// not visible until after first paint. Fully deferred to the client so they
// don't add to the server-rendered HTML or the critical JS bundle.
const FloatingWidgets = dynamic(() => import('./FloatingWidgets').then(m => m.FloatingWidgets), { ssr: false });
const CookieConsent    = dynamic(() => import('./CookieConsent').then(m => m.CookieConsent), { ssr: false });

export function DeferredWidgets({ showCookieConsent }: { showCookieConsent: boolean }) {
  return (
    <>
      <FloatingWidgets />
      {showCookieConsent && <CookieConsent />}
    </>
  );
}
