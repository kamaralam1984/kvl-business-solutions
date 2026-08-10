import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wallet, ShieldCheck, FileText, CalendarOff, Landmark, Fingerprint,
  Star, ArrowRight, CheckCircle2, TrendingUp, CalendarClock, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PaySure — Payroll Software Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: FileText, title: 'Auto Payslip Generation', desc: 'Payslips computed and published the moment payroll runs — no manual formula-juggling in spreadsheets every month.' },
  { Icon: ShieldCheck, title: 'PF / ESI / TDS Compliance', desc: 'Statutory deductions calculated automatically and challans generated in the exact format your compliance filing needs.' },
  { Icon: Landmark, title: 'Form 16 in One Click', desc: 'Year-end Form 16s generated for every employee, cross-checked against filed TDS — no scrambling in April.' },
  { Icon: CalendarOff, title: 'Leave Management', desc: 'Leave balances, approvals and encashment sync straight into the payroll run, so nothing is calculated twice.' },
  { Icon: Landmark, title: 'Bank Transfer File', desc: 'One-click NEFT/RTGS-ready bank file for salary disbursal — matched line by line against your payroll register.' },
  { Icon: Fingerprint, title: 'Attendance Integration', desc: 'Present days, overtime and LOP pull directly from your attendance system into every salary calculation.' },
];

const stats = [
  { value: '900+', label: 'Companies' },
  { value: '₹450Cr+', label: 'Salaries Processed' },
  { value: '99.98%', label: 'Uptime' },
  { value: 'Zero', label: 'Compliance Penalties' },
];

const testimonials = [
  { quote: 'Payroll used to eat up the first four days of every month for my HR team. Now it runs itself and they spend that time on people, not spreadsheets.', name: 'Priya Ramanathan', role: 'Head of HR, Kavya Textiles Pvt Ltd' },
  { quote: 'PF and ESI challans used to be our biggest compliance risk. PaySure generates them correctly every single cycle, and Form 16 season stopped being a fire drill.', name: 'Arvind Subramaniam', role: 'Finance Manager, Trident Logistics Group' },
  { quote: 'We run payroll across three states with different PT slabs. PaySure handles every one of them without us maintaining a single manual rule.', name: 'Meenal Kulkarni', role: 'VP Finance, Orbit Engineering Works' },
];

export default function PayrollDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 grid place-items-center">
              <Wallet className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Pay<span className="text-sky-600">Sure</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/payroll/login" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(2,132,199,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full mb-6">
              <Wallet className="w-3.5 h-3.5" /> Trusted by 900+ companies across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Payroll that<br />runs <span className="text-sky-600">itself.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Salary processing, payslips, and PF/ESI/TDS compliance — accurate pay, on time, without a manual compliance scramble every single month.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/payroll/login" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-sky-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-600" /> Live in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=75&auto=format&fit=crop"
                alt="HR team reviewing payroll and compliance data"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-slate-500">Payroll Accuracy</span>
              </div>
              <div className="text-2xl font-extrabold">100%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-sky-600 rounded-full" style={{ width: '100%' }} />
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
          <div className="text-xs font-bold tracking-widest text-sky-600 uppercase mb-3">Everything Payroll Needs</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how Indian payroll actually works</h2>
          <p className="text-slate-600">From attendance to bank transfer to Form 16 — one system, zero manual reconciliation.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-sky-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-sky-600" />
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
            <div className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live payroll command center</h2>
            <p className="text-slate-400">Headcount, payroll cost, pending approvals and compliance status — the view your HR and finance teams check every cycle.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75&auto=format&fit=crop"
              alt="PaySure payroll dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/payroll/login" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-sky-600 uppercase mb-3">Trusted By HR & Finance Leaders</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Companies feel the difference by payday one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-sky-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Zap className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready for payroll that never slips?</h2>
            <p className="text-sky-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your HR team would use, cycle one.</p>
            <Link href="/demo/payroll/login" className="inline-flex items-center gap-2 bg-white hover:bg-sky-50 text-sky-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-sky-600" /> PaySure — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/payroll" className="font-semibold text-slate-700 hover:text-sky-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your company" CTA */}
      <Link
        href="/software/payroll"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-sky-400" /> Get this for your company
      </Link>
    </div>
  );
}
