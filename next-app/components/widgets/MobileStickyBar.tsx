'use client';
import { Phone, MessageCircle } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
const PHONE_NUMBER = '+919942000413';

export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[98] flex md:hidden"
      style={{ borderTop: '1px solid rgba(var(--border) / 0.08)', background: 'rgb(var(--bg))' }}
    >
      <a
        href={`tel:${PHONE_NUMBER}`}
        onClick={() => trackEvent('call_click', { widget: 'mobile-sticky-bar' })}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold"
        style={{ color: 'rgb(var(--text))', borderRight: '1px solid rgba(var(--border) / 0.08)' }}
      >
        <Phone className="w-4 h-4" /> Call
      </a>
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi KVL, I want to talk to a software consultant.')}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent('whatsapp_click', { widget: 'mobile-sticky-bar' })}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  );
}
