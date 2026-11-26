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
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-3 left-3 right-3 z-[100] rounded-2xl border border-line bg-card px-4 py-3 shadow-soft-3 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[22rem]">
      <button onClick={() => setConsent('rejected')} className="absolute right-0.5 top-0.5 grid h-9 w-9 place-items-center text-text2 hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]" aria-label="Close"><X className="w-3.5 h-3.5" /></button>

      <div className="flex gap-2.5">
        <Cookie aria-hidden className="mt-0.5 hidden h-4 w-4 shrink-0 text-gold-text sm:block" />
        <div className="flex-1 min-w-0 pr-5">
          <p className="text-[13px] leading-snug text-text2">
            <span className="font-semibold text-text">We use cookies</span> for essential features and optional analytics. See our{' '}
            <Link href="/privacy" className="text-gold-text underline underline-offset-2">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2 mt-2.5">
            <button onClick={() => setConsent('accepted')} className={buttonStyles('primary', 'md', 'flex-1 !min-h-[36px] !px-3 !text-[13px]')}>Accept all</button>
            <button onClick={() => setConsent('rejected')} className={buttonStyles('secondary', 'md', 'flex-1 !min-h-[36px] !px-3 !text-[13px]')}>Essential only</button>
          </div>
        </div>
      </div>
    </div>
  );
}
