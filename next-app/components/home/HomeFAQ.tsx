'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

// A representative subset of the full FAQ list at /faq — same real answers,
// not new claims, so this stays consistent with that page.
const FAQS = [
  { q: 'What does KVL offer?', a: 'We provide 15 enterprise software products, custom development, GPS tracking, CCTV, civil work, and industrial automation services across India.' },
  { q: 'Do you serve small businesses?', a: 'Yes — we have plans starting from ₹15,000 designed for small and mid-sized businesses.' },
  { q: 'Will you sign an NDA before discussing our project?', a: 'Yes — an NDA is available on request before we go into any project detail. Just ask on your first call.' },
  { q: 'Cloud or on-premise?', a: 'Most products support both. Cloud is faster to deploy; on-premise gives you full control.' },
  { q: 'Is training included?', a: 'Yes — every license includes 2 hours of free online training plus video documentation.' },
  { q: 'What is your SLA?', a: 'Critical issues: 1 hour. High: 4 hours. Medium: 1 day. Low: 3 days.' },
];

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28" style={{ background: 'rgb(var(--bg-2))' }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="eyebrow mb-4 block">Common Questions</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Before you ask,<br />
            <span style={{ color: 'rgb(var(--gold-text))' }}>here&apos;s what most people want to know.</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl overflow-hidden card-premium"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`home-faq-panel-${i}`}
                  id={`home-faq-trigger-${i}`}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-[14.5px]" style={{ color: 'rgb(var(--text))' }}>{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{ color: 'rgb(var(--gold-text))', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                <div
                  id={`home-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`home-faq-trigger-${i}`}
                  aria-hidden={!isOpen}
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? 200 : 0 }}
                >
                  <p className="px-5 pb-5 text-[13.5px] leading-[1.7]" style={{ color: 'rgb(var(--text-2))' }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold py-2"
            style={{ color: 'rgb(var(--gold-text))' }}
          >
            See all FAQs
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
