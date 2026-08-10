import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench, ClipboardList, MessageSquare, Package, History, UserCog, Receipt,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Gauge, CalendarClock, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GarageOS — Workshop Management Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: ClipboardList, title: 'Service Job Cards', desc: 'Every vehicle gets a digital job card from check-in to handover — no more paper slips lost under the counter.' },
  { Icon: MessageSquare, title: 'SMS Notifications', desc: 'Customers get automatic SMS updates at every stage, so your front desk stops fielding "is my car ready?" calls.' },
  { Icon: Package, title: 'Parts Inventory', desc: 'Spare parts stock tracked against every job, with low-stock alerts before a repair grinds to a halt.' },
  { Icon: History, title: 'Customer History', desc: 'Full service history per vehicle and owner — past jobs, parts used and payments, searchable in seconds.' },
  { Icon: UserCog, title: 'Mechanic Tracking', desc: 'See exactly which mechanic is on which job and how loaded each bay is, right now.' },
  { Icon: Receipt, title: 'Invoice Generation', desc: 'GST-ready invoices generated straight from the job card — labour, parts and taxes, no manual re-entry.' },
];

const stats = [
  { value: '450+', label: 'Workshops Onboard' },
  { value: '180K+', label: 'Jobs Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '30%', label: 'Faster Turnaround' },
];

const testimonials = [
  { quote: 'Job cards used to go missing the moment a car moved between bays. Now every job is tracked from check-in to handover, no exceptions.', name: 'Rajeev Malhotra', role: 'Owner, Malhotra Auto Care' },
  { quote: 'The low-stock alerts alone saved us from at least a dozen delayed deliveries last month. Parts are ordered before they run out, not after.', name: 'Sanjay Deshmukh', role: 'Service Manager, Deshmukh Motors' },
  { quote: 'Customers get SMS updates automatically the moment their car is ready. Our "where is my car" calls have dropped by half.', name: 'Anita Kulkarni', role: 'Owner, Kulkarni Car Clinic' },
];

export default function WorkshopDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 grid place-items-center">
              <Wrench className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Garage<span className="text-indigo-600">OS</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/workshop/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(79,70,229,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-6">
              <Wrench className="w-3.5 h-3.5" /> Trusted by 450+ workshops across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Run your entire workshop<br />without <span className="text-indigo-600">a single lost job card.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              GarageOS replaces scattered paper slips and phone-call updates with tracked service jobs, spare parts and customer history — faster turnarounds, fewer disputes.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/workshop/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=75&auto=format&fit=crop"
                alt="Mechanic servicing a car in a workshop"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-500">Avg Turnaround Time</span>
              </div>
              <div className="text-2xl font-extrabold">1.8 days</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">↓ 30% faster than last quarter</div>
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
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how workshops actually run</h2>
          <p className="text-slate-600">From check-in to invoice, one connected system — no more whiteboards, WhatsApp groups and missing slips.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-indigo-600" />
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
            <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your workshop</h2>
            <p className="text-slate-400">Active job cards, mechanic workload, parts stock and revenue — the view your service manager checks every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=75&auto=format&fit=crop"
              alt="GarageOS dashboard preview — auto workshop interior"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/workshop/login" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">Trusted By Workshop Owners</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Workshops see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <ShieldCheck className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to stop losing job cards?</h2>
            <p className="text-indigo-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your service team would use, day one.</p>
            <Link href="/demo/workshop/login" className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-600" /> GarageOS — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/workshop" className="font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your workshop" CTA */}
      <Link
        href="/software/workshop"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-indigo-400" /> Get this for your workshop
      </Link>
    </div>
  );
}
