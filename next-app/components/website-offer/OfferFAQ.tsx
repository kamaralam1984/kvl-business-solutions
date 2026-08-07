'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Website banane me kitna time lagta hai?', a: 'Basic Starter plan (₹999) 3 din me live ho jata hai. Baaki plans 7 se 30 din tak lagte hain, scope ke hisaab se.' },
  { q: 'Kya domain aur hosting included hai?', a: '₹999 plan me hosting free hai lekin domain included nahi hai — aap apna domain use kar sakte hain ya hum alag se dilwa sakte hain. ₹4,999 aur uske upar ke sabhi plans me domain included hai.' },
  { q: 'Payment kaise kar sakte hain?', a: 'Razorpay ke through UPI, Credit/Debit Card, Net Banking — sab secure tarike se pay kar sakte hain.' },
  { q: 'Kya future me website update kar sakte hain?', a: 'Haan, 30 din ka free support har plan me included hai. Uske baad bhi hum affordable maintenance plans offer karte hain.' },
  { q: 'Kya aap content (text + images) provide karte hain?', a: 'Aap apna content bhej sakte hain, ya humari team basic content likhne me madad kar sakti hai — final scope order ke waqt confirm ho jata hai.' },
];

export function OfferFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#138808' }}>— Frequently Asked Questions —</span>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(o => (o === i ? null : i))}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
