'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBanner({ banner }: { banner: any | null }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!banner) return;
    const key = `kvl_banner_${banner._id}_dismissed`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(key)) setDismissed(true);
  }, [banner]);

  if (!banner || dismissed) return null;

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`kvl_banner_${banner._id}_dismissed`, '1');
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden"
        style={{
          background: 'rgba(200,169,110,0.08)',
          borderBottom: '1px solid rgba(200,169,110,0.2)',
        }}
      >
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none announcement-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(200,169,110,0.12) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="container py-2.5 flex items-center justify-center gap-3 relative z-10">
          <Sparkles className="w-3.5 h-3.5 shrink-0 hidden sm:block" style={{ color: '#c8a870' }} />

          <span className="text-center text-[13px] font-medium" style={{ color: 'rgba(var(--text) / 0.65)' }}>
            {banner.text}
            {banner.link && (
              <Link
                href={banner.link}
                className="inline-flex items-center gap-1 ml-2.5 font-semibold transition-all duration-200 group"
                style={{ color: '#c8a870' }}
              >
                {banner.linkText || 'Learn more'}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            )}
          </span>

          {banner.dismissible && (
            <button
              onClick={dismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ color: 'rgba(var(--text) / 0.35)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.7)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.35)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
