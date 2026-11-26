'use client';
import { buttonStyles } from '@/components/ui';
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
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 z-[100] rounded-panel border border-line bg-card p-5 shadow-soft-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md">
      <button onClick={() => setConsent('rejected')} className="absolute right-1 top-1 grid h-11 w-11 place-items-center text-text2 hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]" aria-label="Close"><X className="w-4 h-4" /></button>

      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15">
          <Cookie aria-hidden className="h-5 w-5 text-gold-text" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text">We use cookies</h3>
          <p className="mt-1 text-sm leading-relaxed text-text2">
            We use essential cookies for auth and optional analytics cookies to improve our site. By accepting, you agree to our use of cookies as described in our{' '}
            <Link href="/privacy" className="text-gold-text underline underline-offset-2">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setConsent('accepted')} className={buttonStyles('primary', 'md', 'flex-1 text-sm')}>Accept all</button>
            <button onClick={() => setConsent('rejected')} className={buttonStyles('secondary', 'md', 'flex-1 text-sm')}>Essential only</button>
          </div>
        </div>
      </div>
    </div>
  );
}
