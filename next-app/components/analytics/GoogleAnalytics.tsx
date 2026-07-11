'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window { gtag?: (...args: any[]) => void; dataLayer?: any[] }
}

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    // Respect cookie consent
    const consent = typeof document !== 'undefined' ? document.cookie.match(/kvl_consent=([^;]+)/)?.[1] : null;
    if (consent !== 'accepted') return;
    const url = pathname + (sp.toString() ? `?${sp}` : '');
    window.gtag('event', 'page_view', { page_path: url });
  }, [pathname, sp]);

  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="ga-init" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
          'wait_for_update': 500
        });
        const consent = document.cookie.match(/kvl_consent=([^;]+)/);
        if (consent && consent[1] === 'accepted') {
          gtag('consent', 'update', { 'ad_storage': 'granted', 'analytics_storage': 'granted' });
        }
        gtag('config', '${gaId}', { send_page_view: false });
      `}</Script>
    </>
  );
}

// Helper to track events from anywhere
export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}
