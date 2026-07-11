'use client';
import Script from 'next/script';

// Mirrors GoogleAnalytics.tsx: no-ops gracefully when NEXT_PUBLIC_GTM_ID is
// unset, and only fires once the `kvl_consent` cookie (set by
// components/widgets/CookieConsent.tsx) is 'accepted'.
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-init" strategy="lazyOnload">{`
        (function() {
          var consent = document.cookie.match(/kvl_consent=([^;]+)/);
          if (!consent || consent[1] !== 'accepted') return;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          var f = document.getElementsByTagName('script')[0];
          var j = document.createElement('script');
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=${gtmId}';
          f.parentNode.insertBefore(j, f);
        })();
      `}</Script>
      {/* The standard GTM <noscript><iframe> fallback is intentionally omitted:
          it would fire unconditionally (no JS = no way to check the consent
          cookie first), which would bypass the cookie-consent gate above. */}
    </>
  );
}
