import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2, Users, MapPin, BadgeIndianRupee, FileStack, MessageCircle,
  ShieldCheck, Star, ArrowRight, CheckCircle2, TrendingUp, Home, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PropertyIQ — Real Estate CRM Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Home, title: 'Property Listings', desc: 'A searchable inventory of every unit you sell or rent — photos, floor plans, pricing and status in one place.' },
  { Icon: Users, title: 'Lead Management', desc: 'Every enquiry from your website, portals and walk-ins lands in one pipeline, scored and assigned automatically.' },
  { Icon: MapPin, title: 'Site Visit Tracking', desc: 'Schedule, confirm and log site visits with reminders — so a hot lead never goes cold waiting on a callback.' },
  { Icon: BadgeIndianRupee, title: 'Commission Calculator', desc: 'Auto-computed broker and channel-partner commissions on every closed deal, with a full payout trail.' },
  { Icon: FileStack, title: 'Document Management', desc: 'Agreements, KYC, payment receipts and NOCs — stored against the deal, never lost in an inbox again.' },
  { Icon: MessageCircle, title: 'WhatsApp Automation', desc: 'Auto-send brochures, visit reminders and payment nudges on WhatsApp the moment a lead moves stage.' },
];

const stats = [
  { value: '500+', label: 'Real Estate Agencies' },
  { value: '90K+', label: 'Properties Listed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '45%', label: 'Higher Lead Conversion' },
];

const testimonials = [
  { quote: 'Enquiries used to sit in a WhatsApp chat until someone remembered to follow up. Now every lead has an owner and a next step — our conversion rate nearly doubled.', name: 'Rajeev Malhotra', role: 'Founder, Skyline Realty' },
  { quote: 'The commission calculator alone saved us three days of Excel reconciliation every month-end. Our channel partners trust the numbers now.', name: 'Anjali Bhatia', role: 'Director, Bhatia Properties' },
  { quote: 'Site visits used to be tracked on a WhatsApp group. Now every visit is logged, every no-show flagged, and our closing rate is up 30%.', name: 'Suresh Nanda', role: 'Broker, Nanda & Sons Realtors' },
];

export default function RealEstateDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 grid place-items-center">
              <Building2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Property<span className="text-emerald-600">IQ</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/real-estate/login" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(5,150,105,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> Trusted by 500+ real estate agencies across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Never let an enquiry<br />go <span className="text-emerald-600">cold again.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Track every lead, site visit and commission in one pipeline — so enquiries convert to bookings instead of dying in someone&apos;s inbox.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/real-estate/login" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=75&auto=format&fit=crop"
                alt="Modern residential building"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-56">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-500">Lead Conversion Rate</span>
              </div>
              <div className="text-2xl font-extrabold">45%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Everything In One Pipeline</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how agencies actually sell</h2>
          <p className="text-slate-600">From first enquiry to final commission payout — no more switching between five different tools.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product preview */}
      <section id="screens" className="bg-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your agency</h2>
            <p className="text-slate-400">Real-time leads, site visits, listings and commissions — the view your sales managers check every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=75&auto=format&fit=crop"
              alt="PropertyIQ dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/real-estate/login" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Trusted By Agencies</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Agencies see the difference in week one</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="rounded-2xl border border-slate-100 p-6 bg-slate-50/50">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-sm font-bold">{t.name}</div>
              <div className="text-xs text-slate-500">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <ShieldCheck className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your agency run smoother?</h2>
            <p className="text-emerald-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your sales team would use, day one.</p>
            <Link href="/demo/real-estate/login" className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" /> PropertyIQ — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/real-estate" className="font-semibold text-slate-700 hover:text-emerald-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your agency" CTA */}
      <Link
        href="/software/real-estate"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Get this for your agency
      </Link>
    </div>
  );
}
