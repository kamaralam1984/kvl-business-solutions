'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { services } from '@/lib/data/services';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const processSteps = [
  { num: '01', title: 'Discovery Call', desc: 'We understand your business needs and goals in a free 30-min consultation.' },
  { num: '02', title: 'Custom Proposal', desc: 'Receive a detailed proposal with scope, timeline and transparent pricing.' },
  { num: '03', title: 'Development', desc: 'Our team builds your solution with weekly progress updates.' },
  { num: '04', title: 'Launch & Support', desc: 'Go live with full training, documentation and lifetime support.' },
];

const faqs = [
  { q: 'Do you offer custom combinations of services?', a: 'Yes — we bundle any mix of our 14+ services. Most clients combine software + website + digital marketing for the best ROI.' },
  { q: 'How long does a typical project take?', a: 'Website projects: 7–14 days. Custom software: 4–12 weeks. GPS/Industrial projects vary by scope.' },
  { q: 'Is there an ongoing maintenance fee?', a: 'All products include 1 year of free support and updates. Renewal is optional and competitively priced.' },
  { q: 'Can I see a live demo before buying?', a: 'Absolutely. Book a free 30-minute demo and our experts will walk you through any product live.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-premium overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm" style={{ color: '#f5f5f0' }}>{q}</span>
        <span
          className="text-2xl leading-none ml-3 shrink-0 transition-transform duration-300 font-light"
          style={{ color: '#c8a96e', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >+</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: '#888' }}>{a}</p>
      </motion.div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div style={{ background: '#0a0a0a' }} className="text-white">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-28">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            OUR SERVICES
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight"
            style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: '#888' }}
          >
            14+ professional services — from custom software to industrial automation and civil engineering.
          </motion.p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Service Cards */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <FadeIn className="text-center mb-14">
            <span className="eyebrow">WHAT WE OFFER</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Core Services
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => {
              const Icon = (Icons as any)[s.icon] || Icons.Box;
              return (
                <FadeIn key={s.slug} delay={i * 0.05}>
                  <div className="card-premium p-6 group h-full flex flex-col">
                    <div
                      className="w-11 h-11 rounded-xl grid place-items-center mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: '#f5f5f0' }} />
                    </div>
                    <h4 className="font-bold mb-2" style={{ color: '#f5f5f0' }}>{s.name}</h4>
                    <p className="text-sm mb-4 flex-1 leading-relaxed" style={{ color: '#888' }}>{s.description}</p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                      style={{ color: '#c8a96e' }}
                    >
                      Enquire <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container">
          <FadeIn className="text-center mb-16">
            <span className="eyebrow">HOW WE WORK</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Our Process
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#888' }}>Simple, transparent and focused on results.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="card-premium p-6 text-center">
                  <div
                    className="w-12 h-12 rounded-full grid place-items-center text-xl font-extrabold mx-auto mb-4"
                    style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e' }}
                  >
                    {step.num}
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: '#f5f5f0' }}>{step.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Universal Benefits */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <FadeIn className="text-center mb-14">
            <span className="eyebrow">EVERY SERVICE INCLUDES</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Our Standard of Excellence
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              'Free consultation & scoping', '1-hour response during business hours',
              'Transparent, fixed pricing', 'GST compliant invoicing',
              '30-day money-back guarantee', 'Free training & onboarding',
              'Lifetime technical support', 'Regular updates & improvements',
              'ISO 9001 quality processes',
            ].map((b, i) => (
              <FadeIn key={b} delay={i * 0.04}>
                <div className="card-premium flex items-center gap-3 px-5 py-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#c8a96e' }} />
                  <span className="text-sm font-medium" style={{ color: '#f5f5f0' }}>{b}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container max-w-3xl">
          <FadeIn className="text-center mb-14">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Common Questions
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <FaqItem q={faq.q} a={faq.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="relative z-10 container text-center">
          <FadeIn>
            <span className="eyebrow">GET STARTED</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Need a custom service combo?
            </h2>
            <p className="mb-8 max-w-xl mx-auto text-sm" style={{ color: '#888' }}>
              Mix and match any of our services. We&apos;ll handle the rest — with one team, one point of contact.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
                Talk to an Expert
              </Link>
              <Link href="/book-demo" className="btn-gold px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
                Book Free Demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
