'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Phone, PhoneCall, Bot, X } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { cn } from '@/components/ui';

const WA = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');

// One contact button: WhatsApp, Call Back and Chat. Chat opens only on click.
export function ContactLauncher({ chatbotEnabled = true }: { chatbotEnabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [open]);

  const item = 'flex min-h-[44px] w-full items-center gap-3 rounded-btn px-3 text-left text-sm font-semibold text-text transition-colors duration-fast hover:bg-text/5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]';

  return (
    <div ref={root} className="fixed bottom-4 right-4 z-[99] sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="menu"
          aria-label="Contact options"
          className="absolute bottom-16 right-0 w-60 rounded-card border border-line bg-card p-2 shadow-soft-3"
        >
          <a
            role="menuitem"
            href={`https://wa.me/${WA}?text=${encodeURIComponent('Hi KVL, I want to talk to a software consultant.')}`}
            target="_blank"
            rel="noreferrer"
            className={item}
            onClick={() => { trackEvent('whatsapp_click', { widget: 'contact-launcher' }); setOpen(false); }}
          >
            <MessageCircle className="h-4 w-4 text-gold-text" aria-hidden /> WhatsApp
          </a>
          <button
            role="menuitem"
            type="button"
            className={item}
            onClick={() => { setOpen(false); window.dispatchEvent(new Event('kvl:open-callback')); }}
          >
            <PhoneCall className="h-4 w-4 text-gold-text" aria-hidden /> Call me back
          </button>
          <a role="menuitem" href="tel:+919942000413" className={item} onClick={() => trackEvent('call_click', { widget: 'contact-launcher' })}>
            <Phone className="h-4 w-4 text-gold-text" aria-hidden /> Call now
          </a>
          {chatbotEnabled && (
            <button
              role="menuitem"
              type="button"
              className={item}
              onClick={() => { setOpen(false); window.dispatchEvent(new Event('kvl:open-chat')); }}
            >
              <Bot className="h-4 w-4 text-gold-text" aria-hidden /> Chat with us
            </button>
          )}
        </div>
      )}
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'grid h-14 w-14 place-items-center rounded-full bg-gold text-[#080910] shadow-soft-3',
          'transition-transform duration-base ease-brand hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
        )}
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      </button>
    </div>
  );
}
