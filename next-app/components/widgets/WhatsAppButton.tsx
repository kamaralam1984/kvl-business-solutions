'use client';
import { useState } from 'react';
import { X, MessageCircle, ArrowRight } from 'lucide-react';

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
  </svg>
);

const QUICK_MESSAGES = [
  { label: 'Software demo chahiye', msg: 'Hi! I want a demo of your software products. Please share details.' },
  { label: 'Pricing aur quote', msg: 'Hi! I want a custom quote for my business. Can we discuss?' },
  { label: 'GPS tracking', msg: 'Hi! I am interested in GPS tracking for my vehicles. Can you share pricing?' },
  { label: 'Support / issue', msg: 'Hi! I am a customer and need help with my product.' },
];

export function WhatsAppButton() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || '919942000413';
  const [open, setOpen] = useState(false);

  const send = (msg: string) => {
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full grid place-items-center text-white shadow-card relative"
        style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
        aria-label="WhatsApp"
      >
        {open ? <X className="w-6 h-6" /> : WHATSAPP_ICON}
        {!open && <span className="absolute inset-0 rounded-full border-2 border-current opacity-50 animate-pulse-ring" />}
        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2" style={{ borderColor: '#128c7e' }} />}
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-80 card-base shadow-card-hover overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 grid place-items-center">{WHATSAPP_ICON}</div>
              <div>
                <div className="font-bold text-sm">KVL Sales Team</div>
                <div className="text-[11px] opacity-90 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" /> Online · Replies in ~5 min
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 text-sm">
            <p className="text-text2 text-xs mb-3">👋 Namaste! Choose a topic or send a custom message:</p>
            <div className="space-y-2 mb-3">
              {QUICK_MESSAGES.map(q => (
                <button key={q.label} onClick={() => send(q.msg)} className="w-full text-left p-2 surface-tint rounded-lg hover:bg-primary/10 text-xs flex justify-between items-center group">
                  <span>{q.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text2 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
            <button onClick={() => send('Hi KVL!')} className="btn w-full justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
              <MessageCircle className="w-4 h-4" /> Open WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
