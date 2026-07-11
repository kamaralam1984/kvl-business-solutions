'use client';
import Script from 'next/script';

// Mirrors GoogleAnalytics.tsx: no-ops gracefully when NEXT_PUBLIC_META_PIXEL_ID
// is unset, and only fires once the `kvl_consent` cookie (set by
// components/widgets/CookieConsent.tsx) is 'accepted'.
export function MetaPixel({ pixelId }: { pixelId: string }) {
  if (!pixelId) return null;

  // The standard Meta Pixel <noscript><img> fallback is intentionally omitted:
  // it would fire unconditionally (no JS = no way to check the consent cookie
  // first), which would bypass the cookie-consent gate below.
  return (
    <Script id="meta-pixel-init" strategy="lazyOnload">{`
      (function() {
        var consent = document.cookie.match(/kvl_consent=([^;]+)/);
        if (!consent || consent[1] !== 'accepted') return;
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', '${pixelId}');
        window.fbq('track', 'PageView');
      })();
    `}</Script>
  );
}
