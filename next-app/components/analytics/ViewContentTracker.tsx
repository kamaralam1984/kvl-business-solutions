'use client';
import { useEffect } from 'react';
import { trackEvent } from './GoogleAnalytics';

// Fires Meta's ViewContent (+ GA4/DB event) once per mount — mounted on
// product detail pages and /pricing so retargeting audiences can be built
// from "viewed this product," not just Lead/Purchase.
export function ViewContentTracker({ id, name, value, category }: { id: string; name: string; value?: number; category?: string }) {
  useEffect(() => {
    trackEvent('view_content', { content_ids: [id], content_name: name, content_category: category, value, currency: 'INR' });
    // Fire once per mount (per product/page id) — not on every keystroke-driven re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return null;
}
