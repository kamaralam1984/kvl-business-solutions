'use client';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Check, X, AlertTriangle, Phone } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import type { Software } from '@/lib/data/software';

// Campaign-only presentation facts (delivery time, domain inclusion) — kept
// here rather than on the shared Software type since they're specific to
// this landing page's copy, not a property other pages need to know about.
const DELIVERY_DAYS: Record<string, number> = {
  'independence-day-website': 3,
  'website-business-4999': 7,
  'website-growth-9999': 15,
  'website-advanced-14999': 30,
  'website-custom-25000': 45,
};
const DOMAIN_INCLUDED: Record<string, boolean> = {
  'independence-day-website': false,
  'website-business-4999': true,
  'website-growth-9999': true,
  'website-advanced-14999': true,
  'website-custom-25000': true,
};
const ORDER = ['independence-day-website', 'website-business-4999', 'website-growth-9999', 'website-advanced-14999', 'website-custom-25000'];

export function PricingSection({ plans }: { plans: Software[] }) {
  const { ref, inView } = useReveal();
  const sorted = ORDER.map(slug => plans.find(p => p.slug === slug)).filter((p): p is Software => Boolean(p));

  return (
    <section id="pricing" className="py-20" style={{ background: '#f8f9fb' }}>
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="text-center mb-4">
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#138808' }}>— Simple Pricing Plans —</span>
        </div>

        <div className="flex items-start gap-2 max-w-2xl mx-auto mb-10 p-3 rounded-xl border" style={{ background: '#fffbeb', borderColor: '#fbbf24' }}>
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-semibold">
            Important: the ₹999 plan does not include a domain — every other plan below includes one.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sorted.map((p, i) => {
            const Icon = (Icons as any)[p.icon] || Icons.Globe;
            const domainIncluded = DOMAIN_INCLUDED[p.slug];
            const days = DELIVERY_DAYS[p.slug];
            const isCustom = p.slug === 'website-custom-25000';
            return (
              <div
                key={p.slug}
                style={revealStyle(inView, i)}
                className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex flex-col flex-1" style={{ borderTop: `4px solid ${p.c1}` }}>
                  {p.tag && (
                    <span
                      className="self-start text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full text-white mb-2"
                      style={{ background: `linear-gradient(90deg,${p.c1},${p.c2})` }}
                    >
                      {p.tag}
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="grid place-items-center w-7 h-7 rounded-lg" style={{ background: `linear-gradient(135deg,${p.c1},${p.c2})` }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{p.name}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900 mb-0.5">
                    {formatINR(p.price)}<span className="text-xs font-medium text-gray-400">{p.unit}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${domainIncluded ? '' : ''}`}
                    style={domainIncluded ? { background: '#dcfce7', color: '#15803d' } : { background: '#fee2e2', color: '#b91c1c' }}
                  >
                    {domainIncluded ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {domainIncluded ? 'Domain Included' : 'Domain Not Included'}
                  </span>

                  <ul className="space-y-1.5 mb-4 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-gray-600">
                        <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                    <li className="flex items-start gap-1.5 text-[11.5px] text-gray-600">
                      <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> {days} Days Delivery
                    </li>
                  </ul>

                  {isCustom ? (
                    <a
                      href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '')}?text=${encodeURIComponent(`I'm interested in the ${p.name} plan`)}`}
                      target="_blank" rel="noreferrer"
                      className="w-full py-2.5 rounded-lg text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                      style={{ background: `linear-gradient(90deg,${p.c1},${p.c2})` }}
                    >
                      <Phone className="w-3.5 h-3.5" /> Contact Us
                    </a>
                  ) : (
                    <Link
                      href={`/checkout?product=${p.slug}&host=cloud`}
                      className="w-full py-2.5 rounded-lg text-center text-xs font-bold text-white"
                      style={{ background: `linear-gradient(90deg,${p.c1},${p.c2})` }}
                    >
                      Order Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
