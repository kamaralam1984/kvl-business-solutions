'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Megaphone } from 'lucide-react';

const variantStyles: Record<string, string> = {
  promo: 'bg-gradient-to-r from-primary to-primary-600 text-white',
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
};

export function AnnouncementBanner({ banner }: { banner: any | null }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!banner) return;
    const key = `kvl_banner_${banner._id}_dismissed`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(key)) setDismissed(true);
  }, [banner]);

  if (!banner || dismissed) return null;
  const styles = variantStyles[banner.variant || 'promo'] || variantStyles.promo;

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`kvl_banner_${banner._id}_dismissed`, '1');
    }
    setDismissed(true);
  };

  return (
    <div className={`${styles} relative`}>
      <div className="container py-2 flex items-center justify-center gap-3 text-sm font-medium">
        <Megaphone className="w-4 h-4 shrink-0 hidden sm:block" />
        <span className="text-center">
          {banner.text}
          {banner.link && (
            <Link href={banner.link} className="underline ml-2 font-bold hover:opacity-80">
              {banner.linkText || 'Learn more'} →
            </Link>
          )}
        </span>
        {banner.dismissible && (
          <button onClick={dismiss} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
