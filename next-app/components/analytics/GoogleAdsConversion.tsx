'use client';
import Script from 'next/script';

declare global {
  interface Window { gtag?: (...args: any[]) => void; dataLayer?: any[] }
}

// Mirrors GoogleAnalytics.tsx: no-ops gracefully when NEXT_PUBLIC_GOOGLE_ADS_ID
// is unset, and only fires once the `kvl_consent` cookie (set by
// components/widgets/CookieConsent.tsx) is 'accepted'. Loads its own gtag.js
// so Ads conversions work even on pages where GA4 didn't load (e.g. GA_ID unset).
export function GoogleAdsConversion({ adsId }: { adsId: string }) {
  if (!adsId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`} strategy="lazyOnload" />
      <Script id="google-ads-init" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        window.gtag('js', new Date());
        const consent = document.cookie.match(/kvl_consent=([^;]+)/);
        if (consent && consent[1] === 'accepted') {
          window.gtag('config', '${adsId}');
        }
      `}</Script>
    </>
  );
}

// Fires a Google Ads conversion event. `conversionLabel` is the "AW-XXXXXXX/LABEL"
// string from the Google Ads conversion action (set per-event via env vars, e.g.
// NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LEAD). No-ops if consent wasn't granted or
// the conversion label isn't configured, matching every other analytics helper here.
export function trackAdsConversion(conversionLabel: string | undefined, params?: Record<string, any>) {
  if (!conversionLabel) return;
  if (typeof window === 'undefined' || !window.gtag) return;
  const consent = typeof document !== 'undefined' ? document.cookie.match(/kvl_consent=([^;]+)/)?.[1] : null;
  if (consent !== 'accepted') return;
  window.gtag('event', 'conversion', { send_to: conversionLabel, ...params });
}
