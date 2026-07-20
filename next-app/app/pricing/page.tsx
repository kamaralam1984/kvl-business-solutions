'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { softwareProducts } from '@/lib/data/software';
import { formatINR } from '@/lib/utils';
import { Check, Calendar, Shield, Clock, Award } from 'lucide-react';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const universalFeatures = [
  'Free installation & setup',
  '1-year unlimited support',
  'Free training (2 hours)',
  'GST compliant',
  '30-day money-back',
  'Cloud + On-Premise',
  'Free updates for 12 months',
  'Mobile-friendly dashboard',
];

const planTiers = [
  {
    name: 'Starter',
    desc: 'For small businesses ready to move off spreadsheets and manual processes',
    products: ['billing', 'attendance', 'payroll'],
    extras: ['Up to 5 users', 'Email support', 'Cloud hosting included'],
    tag: '',
    badge: '',
  },
  {
    name: 'Business',
    desc: 'For growing companies that need real-time visibility across sales, inventory and operations',
    products: ['erp', 'crm', 'inventory'],
    extras: ['Up to 25 users', 'Priority email + chat', 'Cloud or on-premise', 'Custom integrations (5)'],
    tag: 'MOST POPULAR',
    badge: 'popular',
  },
  {
    name: 'Enterprise',
    desc: 'For large or multi-location operations that need dedicated support and guaranteed uptime',
    products: ['ai-business', 'hospital', 'school'],
    extras: ['Unlimited users', '24×7 dedicated support', 'On-premise + dedicated server', 'Custom modules', 'SLA guarantee 99.9%'],
    tag: 'ENTERPRISE',
    badge: 'gold',
  },
];

const pricingFaqs = [
  { q: 'Are there any hidden fees?', a: 'No. The price you see is what you pay. GST is added at checkout per government norms.' },
  { q: 'What happens after the 1-year support period?', a: 'You can renew support at a discounted rate, or continue using the software without support.' },
  { q: 'Can I upgrade from Starter to Business later?', a: 'Yes — we offer seamless upgrades with data migration included at no extra charge.' },
  { q: 'Do you offer EMI or installment payments?', a: 'Yes, we partner with leading banks for 0% EMI on orders above ₹10,000.' },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div style={{ background: 'rgb(var(--bg))' }}>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-28">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            TRANSPARENT PRICING
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight"
            style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}
          >
            Straightforward Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'rgba(var(--text) / 0.55)' }}
          >
            Know exactly what you're paying for and what you get — no hidden fees, no surprise renewals, 30-day money-back on everything.
          </motion.p>

          {/* Annual toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <span className="text-sm" style={{ color: isAnnual ? 'rgba(var(--text) / 0.55)' : 'rgb(var(--text))' }}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300"
              style={{ background: isAnnual ? '#c8a96e' : 'rgba(var(--border) / 0.2)' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                style={{ transform: isAnnual ? 'translateX(26px)' : 'translateX(4px)' }}
              />
            </button>
            <span className="text-sm" style={{ color: isAnnual ? 'rgb(var(--text))' : 'rgba(var(--text) / 0.55)' }}>
              Annual <span className="text-xs px-1.5 py-0.5 rounded ml-1" style={{ background: 'rgba(200,169,110,0.15)', color: '#c8a96e' }}>Save 20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Plan Tiers */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <FadeIn className="text-center mb-4">
            <h2 className="text-3xl font-extrabold" style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}>Compare plans</h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(var(--text) / 0.55)' }}>Bundle multiple products and save up to 30%.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {planTiers.map((tier, idx) => {
              const products = tier.products.map(slug => softwareProducts.find(p => p.slug === slug)!).filter(Boolean);
              const total = products.reduce((s, p) => s + p.price, 0);
              const discount = tier.name === 'Business' ? 0.15 : tier.name === 'Enterprise' ? 0.30 : 0;
              const annualDiscount = isAnnual ? 0.2 : 0;
              const final = Math.round(total * (1 - discount) * (1 - annualDiscount));
              const isPopular = tier.badge === 'popular';
              const isEnterprise = tier.badge === 'gold';
              return (
                <FadeIn key={tier.name} delay={idx * 0.1}>
                  <div
                    className="card-premium p-7 relative flex flex-col h-full"
                    style={isPopular ? { borderColor: 'rgba(200,169,110,0.4)', boxShadow: '0 0 40px -10px rgba(200,169,110,0.15)' } : {}}
                  >
                    {tier.tag && (
                      <div
                        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-bold${isPopular ? '' : ' text-text'}`}
                        style={{
                          background: isPopular ? 'rgba(200,169,110,0.15)' : 'rgba(var(--border) / 0.07)',
                          border: isPopular ? '1px solid rgba(200,169,110,0.4)' : '1px solid rgba(var(--border) / 0.15)',
                          color: isPopular ? '#c8a96e' : undefined,
                        }}
                      >
                        {tier.tag}
                      </div>
                    )}
                    <h3 className="text-2xl font-extrabold mt-2 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>{tier.name}</h3>
                    <p className="text-xs mt-1 mb-5 text-text2">{tier.desc}</p>
                    <div className="mb-6">
                      {discount > 0 && (
                        <div className="text-sm line-through text-text3">{formatINR(Math.round(total * (1 - annualDiscount)))}</div>
                      )}
                      <div className="text-4xl font-extrabold text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {formatINR(final)}
                        <span className="text-base font-normal ml-1 text-text2">/{isAnnual ? 'year' : 'mo'}</span>
                      </div>
                      {discount > 0 && (
                        <div className="text-xs font-semibold mt-1" style={{ color: '#4ade80' }}>Save {Math.round(discount * 100)}% as a bundle</div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm mb-5 pb-5" style={{ borderBottom: '1px solid rgba(var(--border) / 0.07)' }}>
                      <div className="text-xs uppercase font-bold mb-3 tracking-wider text-text2">Includes</div>
                      {products.map(p => (
                        <div key={p.slug} className="flex gap-2 items-center">
                          <Check className="w-4 h-4 shrink-0" style={{ color: '#c8a96e' }} />
                          <span className="text-text">{p.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm mb-6 flex-1">
                      {tier.extras.map(e => (
                        <div key={e} className="flex gap-2 items-center text-text2">
                          <span className="text-xs shrink-0" style={{ color: '#c8a96e' }}>✓</span>
                          <span>{e}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/contact"
                      className={isPopular ? 'btn-primary w-full text-center py-3 rounded-xl font-semibold' : 'btn-gold w-full text-center py-3 rounded-xl font-semibold'}
                    >
                      Get {tier.name}
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Universal Features */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container">
          <FadeIn className="text-center mb-12">
            <span className="eyebrow">INCLUDED IN EVERY PLAN</span>
            <h2 className="text-3xl font-extrabold my-3" style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}>All plans include</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {universalFeatures.map((f, i) => (
              <FadeIn key={f} delay={i * 0.04}>
                <div className="card-premium flex items-center gap-3 px-4 py-3">
                  <Check className="w-4 h-4 shrink-0" style={{ color: '#c8a96e' }} />
                  <span className="text-sm text-text">{f}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Products Table */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-extrabold" style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}>Individual products</h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(var(--text) / 0.55)' }}>Prefer one product at a time? Buy individually — all prices in INR, GST extra.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="card-premium overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead style={{ borderBottom: '1px solid rgba(var(--border) / 0.07)' }}>
                  <tr className="text-left text-xs uppercase tracking-wider text-text2">
                    <th className="p-4">Product</th>
                    <th className="p-4 text-right">Cloud</th>
                    <th className="p-4 text-right">On-Premise</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {softwareProducts.map(p => {
                    const onPrem = Math.round(p.price * 1.5);
                    return (
                      <tr key={p.slug} className="transition-colors" style={{ borderBottom: '1px solid rgba(var(--border) / 0.04)' }}>
                        <td className="p-4">
                          <div className="font-bold text-text">{p.name}</div>
                          <div className="text-xs mt-0.5 text-text2">{p.category}</div>
                          <ul className="mt-1.5 space-y-0.5">
                            {p.features?.slice(0, 2).map((f: string) => (
                              <li key={f} className="flex gap-1 items-center text-xs text-text2">
                                <Check className="w-3 h-3 shrink-0" style={{ color: 'rgba(200,169,110,0.6)' }} /> {f}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-bold text-base text-text">{formatINR(p.price)}</div>
                          <div className="text-[10px] text-text2">{p.unit}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-bold text-text2">{formatINR(onPrem)}</div>
                          <div className="text-[10px] text-text2">{p.unit}</div>
                        </td>
                        <td className="p-4 text-right">
                          <Link href="/book-demo" className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1">Demo</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FadeIn>
          <div className="text-center mt-10">
            <Link href="/book-demo" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 mr-3">
              <Calendar className="w-4 h-4" /> Book a free demo
            </Link>
            <Link href="/contact" className="btn-ghost px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              Need custom pricing?
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container max-w-3xl">
          <FadeIn className="text-center mb-12">
            <span className="eyebrow">PRICING FAQ</span>
            <h2 className="text-3xl font-extrabold my-3" style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}>
              Frequently Asked Questions
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {pricingFaqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="card-premium overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-sm text-text">{faq.q}</span>
                    <span
                      className="text-2xl leading-none ml-3 shrink-0 transition-transform duration-300 font-light"
                      style={{ color: '#c8a96e', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >+</span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-text2">{faq.a}</p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { Icon: Shield, title: '30-Day Money-Back', desc: 'Not satisfied? Full refund, no questions asked.' },
              { Icon: Clock, title: '1-Hour Response', desc: 'Our support team replies within 60 minutes during business hours.' },
              { Icon: Award, title: 'MSME Registered', desc: 'Govt. of India registered, with an NDA available on request.' },
            ].map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.1}>
                <div className="card-premium p-6 text-center">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mx-auto mb-4" style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <t.Icon className="w-5 h-5" style={{ color: '#c8a96e' }} />
                  </div>
                  <h4 className="font-bold mb-2 text-sm text-text">{t.title}</h4>
                  <p className="text-sm text-text2">{t.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="relative z-10 container text-center">
          <FadeIn>
            <span className="eyebrow">NEED HELP CHOOSING?</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}>
              Still not sure which plan fits?
            </h2>
            <p className="mb-7 max-w-xl mx-auto text-sm" style={{ color: 'rgba(var(--text) / 0.55)' }}>
              Talk to a solution architect for a bundle recommendation matched to your business size and industry — a free 30-minute consultation, no obligation.
            </p>
            <Link href="/contact" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              Talk to a Solution Architect
            </Link>
            <Link href="/downloads" className="inline-block mt-6 text-sm underline" style={{ color: 'rgba(var(--text) / 0.55)' }}>
              Download our Service Brochure & Company Profile
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
