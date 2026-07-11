'use client';
import dynamic from 'next/dynamic';

// Dismissible promo banner — not critical for first paint, and its
// framer-motion dependency shouldn't be in the eager/critical bundle.
const AnnouncementBanner = dynamic(() => import('./AnnouncementBanner').then(m => m.AnnouncementBanner), { ssr: false });

export function DeferredBanner({ banner }: { banner: any | null }) {
  if (!banner) return null;
  return <AnnouncementBanner banner={banner} />;
}
