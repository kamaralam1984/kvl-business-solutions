'use client';
import Script from 'next/script';

// Mirrors GoogleAnalytics.tsx: no-ops gracefully when NEXT_PUBLIC_CLARITY_ID
// is unset, and only fires once the `kvl_consent` cookie (set by
// components/widgets/CookieConsent.tsx) is 'accepted'.
export function MicrosoftClarity({ clarityId }: { clarityId: string }) {
  if (!clarityId) return null;

  return (
    <Script id="clarity-init" strategy="lazyOnload">{`
      (function() {
        var consent = document.cookie.match(/kvl_consent=([^;]+)/);
        if (!consent || consent[1] !== 'accepted') return;
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      })();
    `}</Script>
  );
}
