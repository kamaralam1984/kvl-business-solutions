import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Network, Landmark, ShoppingCart, Warehouse, Users, FileBarChart2, Building2,
  ShieldCheck, Star, ArrowRight, CheckCircle2, TrendingUp, CalendarClock, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CoreStack ERP — Enterprise Resource Planning Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Building2, title: 'Multi-Branch Support', desc: 'Consolidated visibility across every branch and warehouse, with drill-down to the transaction level whenever you need it.' },
  { Icon: ShieldCheck, title: 'GST Compliant', desc: 'GST-ready invoicing, e-way bills and return-ready reports built in — no more reconciling spreadsheets before filing.' },
  { Icon: Network, title: 'Cloud + Local Hosting', desc: 'Run on the cloud, on-premise, or both — your infrastructure, your call, without re-platforming later.' },
  { Icon: Landmark, title: 'Financial Accounting', desc: 'Ledgers, journals, P&L and balance sheets update in real time as every module posts its transactions.' },
  { Icon: ShoppingCart, title: 'Purchase Management', desc: 'Requisition to PO to GRN to vendor payment — one approval chain, fully auditable end to end.' },
  { Icon: FileBarChart2, title: 'Custom Reports', desc: 'Build the reports finance actually asks for, and schedule them to hit the right inbox automatically.' },
];

const stats = [
  { value: '350+', label: 'Enterprises' },
  { value: '₹2,400Cr+', label: 'Transactions Processed' },
  { value: '99.98%', label: 'Uptime SLA' },
  { value: '40%', label: 'Faster Month-End Close' },
];

const testimonials = [
  { quote: 'We closed our books in 3 days instead of 12. Finance, sales and inventory finally look at the same numbers.', name: 'Rakesh Aggarwal', role: 'CFO, Meridian Industrial Group' },
  { quote: 'Purchase approvals used to bounce across five email threads. Now every PO has one clean audit trail from request to payment.', name: 'Neha Kulkarni', role: 'Head of Operations, Vantage Manufacturing' },
  { quote: 'Multi-branch reconciliation was our biggest headache. CoreStack gave us one ledger across 14 locations, live.', name: 'Suresh Pillai', role: 'Director of Finance, Anchor Retail Holdings' },
];

export default function ErpDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center">
              <Network className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">CoreStack<span className="text-blue-600">ERP</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/erp/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
              <Network className="w-3.5 h-3.5" /> Trusted by 350+ enterprises across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Run your entire business<br />on <span className="text-blue-600">one platform.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Finance, HR, sales, purchase and inventory — unified into one real-time system, so decisions stop waiting on someone&apos;s spreadsheet.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/erp/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Setup in 72 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=75&auto=format&fit=crop"
                alt="Enterprise team reviewing business data"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-500">Monthly Revenue</span>
              </div>
              <div className="text-2xl font-extrabold">₹1.86Cr</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '76%' }} />
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
          <div className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how enterprises actually run</h2>
          <p className="text-slate-600">Every department, one connected system — no more reconciling five different tools at month-end.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-blue-600" />
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
            <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your business</h2>
            <p className="text-slate-400">Real-time revenue, purchase orders, headcount and stock levels — the view your leadership checks every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75&auto=format&fit=crop"
              alt="CoreStack ERP dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/erp/login" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">Trusted By Finance & Ops Leaders</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Enterprises see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Warehouse className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your business run smoother?</h2>
            <p className="text-blue-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your team would use, day one.</p>
            <Link href="/demo/erp/login" className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600" /> CoreStack ERP — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/erp" className="font-semibold text-slate-700 hover:text-blue-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your business" CTA */}
      <Link
        href="/software/erp"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-blue-400" /> Get this for your business
      </Link>
    </div>
  );
}
