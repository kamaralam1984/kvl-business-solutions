'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'How long does it take to build a website?', a: 'The Basic Starter plan (₹999) goes live in 3 days. Other plans take 7 to 30 days depending on scope.' },
  { q: 'Is domain and hosting included?', a: 'The ₹999 plan includes free hosting but not a domain — you can use your own or we can help you buy one separately. All plans ₹4,999 and above include a domain.' },
  { q: 'How can I make payment?', a: 'Pay securely via Razorpay — UPI, Credit/Debit Card, or Net Banking are all supported.' },
  { q: 'Can I update the website later?', a: 'Yes, 30 days of free support is included with every plan. After that, we also offer affordable maintenance plans.' },
  { q: 'Do you provide content (text + images)?', a: 'You can send us your own content, or our team can help write basic content for you — the final scope is confirmed at the time of ordering.' },
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
