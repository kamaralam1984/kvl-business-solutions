'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users, ShieldCheck, Rocket, Smartphone, Heart, Palette, Search, Zap as ZapIcon,
  MessageCircle, Headphones as HeadphonesIcon, Check, Sparkles, Phone, Mail, MapPin,
} from 'lucide-react';
import { LiveSocialProof } from '@/components/shared/LiveSocialProof';
import { PortfolioCarousel } from '@/components/website-offer/PortfolioCarousel';
import { PricingSection } from '@/components/website-offer/PricingSection';
import { TestimonialsCarousel } from '@/components/website-offer/TestimonialsCarousel';
import { OfferFAQ } from '@/components/website-offer/OfferFAQ';
import { QuoteForm } from '@/components/website-offer/QuoteForm';
import { HeroCapture } from '@/components/website-offer/HeroCapture';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import type { Software } from '@/lib/data/software';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const TRUST = [
  { Icon: Users, value: '100+', label: 'Happy Clients' },
  { Icon: ShieldCheck, value: '100%', label: 'Secure Payment' },
  { Icon: Rocket, value: '3 Days', label: 'Delivery' },
  { Icon: Smartphone, value: '100%', label: 'Mobile Responsive' },
  { Icon: Heart, value: '100%', label: 'Satisfaction' },
];

const WHY = [
  { Icon: Palette, label: 'Modern & Unique Design' },
  { Icon: Search, label: 'SEO Friendly Websites' },
  { Icon: Smartphone, label: 'Mobile & Tablet Responsive' },
  { Icon: MessageCircle, label: 'WhatsApp Integration' },
  { Icon: HeadphonesIcon, label: 'Free Support 30 Days' },
  { Icon: ZapIcon, label: '24/7 Customer Support' },
];

const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
const PHONE = '+91 99420 00413';
const EMAIL = 'info@kvlbusinesssolutions.com';

export function WebsiteOfferClient({ plans, reviews, portfolio }: {
  plans: Software[];
  reviews: { name: string; company?: string; rating: number; title?: string; message: string }[];
  portfolio: { slug: string; name: string; industry: string; image: string; tagline: string }[];
}) {
  const { ref: heroRef, inView: heroInView } = useReveal('0px');
  const { ref: whyRef, inView: whyInView } = useReveal();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 shrink-0">
            <Image src="/brand-logo.png" alt="KVL Business Solutions" width={130} height={40} className="h-9 w-auto object-contain" />
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="text-sm font-semibold text-gray-600 hover:text-gray-900">{n.label}</a>
            ))}
          </nav>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('I want a website')}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold"
            style={{ background: '#25D366' }}
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#0b1a3a 0%,#122759 55%,#0b1a3a 100%)' }}>
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: '#2563eb' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: '#7c3aed' }} />

        <div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-4 py-14 sm:py-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div style={revealStyle(heroInView, 0)}>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full text-white" style={{ background: 'linear-gradient(90deg,#2563eb,#7c3aed)' }}>
                <Sparkles className="w-3 h-3" /> Limited Time Offer
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.08] mb-4">
              Professional Website<br />
              <span style={{ color: '#60a5fa' }}>Grow Your Business</span>
            </h1>
            <div className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: '#60a5fa' }}>
              Get Started with an Advance Payment
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-7">
              {['Modern Design', 'Mobile Friendly', 'SEO Optimized'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-white/85"><Check className="w-4 h-4 text-green-400" /> {t}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#quote-form" className="px-6 py-3 rounded-lg font-bold text-white text-sm" style={{ background: 'linear-gradient(90deg,#2563eb,#1d4ed8)' }}>
                Get Free Quote →
              </a>
              <a href="#pricing" className="px-6 py-3 rounded-lg font-bold text-white text-sm border border-white/30 hover:bg-white/10">
                View Plans
              </a>
            </div>
            <div className="mt-4"><LiveSocialProof path="/website-offer" dark /></div>
          </div>

          <div id="quote-form" style={revealStyle(heroInView, 1)} className="flex justify-center lg:justify-end scroll-mt-24">
            <Suspense fallback={<QuoteForm />}>
              <HeroCapture />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-5 gap-6">
          {TRUST.map(t => (
            <div key={t.label} className="text-center">
              <t.Icon className="w-6 h-6 mx-auto mb-1.5" style={{ color: '#2563eb' }} />
              <div className="font-extrabold text-lg text-gray-900">{t.value}</div>
              <div className="text-[11px] text-gray-500">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section id="features" className="py-16 bg-white">
        <div ref={whyRef} className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#2563eb' }}>— Why Choose KVL Business Solutions? —</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {WHY.map((w, i) => (
              <div key={w.label} style={revealStyle(whyInView, i)} className="text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-2 grid place-items-center" style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                  <w.Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-semibold text-gray-700">{w.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioCarousel portfolio={portfolio} />
      <PricingSection plans={plans} />
      <TestimonialsCarousel reviews={reviews} />
      <OfferFAQ />

      {/* Payment methods */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">We Accept Secure Payments</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Razorpay', 'UPI', 'Credit / Debit Card', 'Net Banking'].map(m => (
              <span key={m} className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600">{m}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> 100% Secure Payments · Your data is safe with us
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 relative overflow-hidden" style={{ background: 'linear-gradient(90deg,#2563eb,#7c3aed)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Take a Step Towards Digital Growth</h2>
          <p className="text-white/90 mb-6">Grow your business online. Book your website today!</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#quote-form" className="px-6 py-3 rounded-lg font-bold text-sm bg-white" style={{ color: '#2563eb' }}>Get Free Quote</a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('I want a website')}`}
              target="_blank" rel="noreferrer"
              className="px-6 py-3 rounded-lg font-bold text-sm text-white border border-white/50 hover:bg-white/10 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12" style={{ background: '#0b1a3a' }}>
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-8 text-white/70 text-sm">
          <div>
            <Image src="/brand-logo.png" alt="KVL Business Solutions" width={130} height={40} className="h-9 w-auto object-contain mb-3 brightness-0 invert" />
            <p className="text-xs leading-relaxed">Transforming Ideas Into Digital Success.</p>
          </div>
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wide mb-3">Quick Links</div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><Link href="/projects" className="hover:text-white">Portfolio</Link></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wide mb-3">Contact Us</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {PHONE}</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {EMAIL}</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Patna, Bihar, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-center text-[11px] text-white/40">
          © {new Date().getUTCFullYear()} KVL Business Solutions. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
