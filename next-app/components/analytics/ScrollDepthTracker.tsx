'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from './track';

const THRESHOLDS = [25, 50, 75, 100];

// Fires a `scroll_depth` event the first time a visitor crosses each 25%
// milestone of page height, once per page view. Resets its fired-thresholds
// set on every route change (Next.js App Router doesn't remount this
// component on client-side navigation, so pathname is a dependency).
export function ScrollDepthTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const fired = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;

      for (const t of THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent('scroll_depth', { percent: t, path: pathname });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return null;
}
