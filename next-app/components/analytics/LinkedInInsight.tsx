'use client';
import Script from 'next/script';

// Mirrors GoogleAnalytics.tsx: no-ops gracefully when
// NEXT_PUBLIC_LINKEDIN_PARTNER_ID is unset, and only fires once the
// `kvl_consent` cookie (set by components/widgets/CookieConsent.tsx) is
// 'accepted'.
export function LinkedInInsight({ partnerId }: { partnerId: string }) {
  if (!partnerId) return null;

  // The standard LinkedIn Insight Tag <noscript><img> fallback is
  // intentionally omitted: it would fire unconditionally (no JS = no way to
  // check the consent cookie first), which would bypass the gate below.
  return (
    <Script id="linkedin-insight-init" strategy="lazyOnload">{`
      (function() {
        var consent = document.cookie.match(/kvl_consent=([^;]+)/);
        if (!consent || consent[1] !== 'accepted') return;
        window._linkedin_partner_id = '${partnerId}';
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push('${partnerId}');
        (function(l) {
          if (!l) {
            window.lintrk = function(a,b) { window.lintrk.q.push([a,b]) };
            window.lintrk.q = [];
          }
          var s = document.getElementsByTagName('script')[0];
          var b = document.createElement('script');
          b.type = 'text/javascript'; b.async = true;
          b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
          s.parentNode.insertBefore(b, s);
        })(window.lintrk);
      })();
    `}</Script>
  );
}
