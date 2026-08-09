'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = document.cookie.match(/kvl_consent=([^;]+)/);
    if (!consent) setShow(true);
  }, []);

  const setConsent = (value: 'accepted' | 'rejected') => {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `kvl_consent=${value}; expires=${expires}; path=/; SameSite=Lax`;
    if (value === 'accepted') {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', { 'ad_storage': 'granted', 'analytics_storage': 'granted' });
      }
      // Lets VipTracker (already mounted, already past its initial consent
      // check) start recording immediately instead of waiting for a page
      // reload that may never come — see components/vip/VipTracker.tsx.
      window.dispatchEvent(new Event('kvl-consent-accepted'));
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-md z-[100] card-base p-5 shadow-card-hover animate-in slide-in-from-bottom-4">
      <button onClick={() => setConsent('rejected')} className="absolute top-3 right-3 text-text2 hover:text-text" aria-label="Close"><X className="w-4 h-4" /></button>

      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 grid place-items-center shrink-0">
          <Cookie className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">We use cookies</h3>
          <p className="text-xs text-text2 mt-1 leading-relaxed">
            We use essential cookies for auth and optional analytics cookies to improve our site. By accepting, you agree to our use of cookies as described in our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setConsent('accepted')} className="btn btn-primary text-xs flex-1 justify-center">Accept all</button>
            <button onClick={() => setConsent('rejected')} className="btn btn-ghost border border-tint text-xs flex-1 justify-center">Essential only</button>
          </div>
        </div>
      </div>
    </div>
  );
}
