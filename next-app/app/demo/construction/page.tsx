import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  HardHat, ClipboardList, TrendingUp, Users2, Truck, GanttChartSquare, Wallet,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Building2, CalendarClock, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'SiteControl — Construction Management Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: ClipboardList, title: 'BOQ & Estimation', desc: 'Build accurate bills of quantities in minutes and track every line item against actual site consumption.' },
  { Icon: TrendingUp, title: 'Site Progress Tracking', desc: 'Daily progress updates from every site, rolled up into one live percentage-complete view for every project.' },
  { Icon: Truck, title: 'Vendor Management', desc: 'One system for every supplier and subcontractor — POs, rate contracts, and payment status, all in one place.' },
  { Icon: Users2, title: 'Labour Management', desc: 'Track attendance, wages and productivity across sites, with muster-roll data that reconciles itself.' },
  { Icon: GanttChartSquare, title: 'Gantt Chart', desc: 'Visual project timelines that flag slippage the moment a dependent task falls behind schedule.' },
  { Icon: Wallet, title: 'Cost Control', desc: 'Budget vs. actual tracked in real time, so cost overruns get caught at ₹10,000, not ₹10,00,000.' },
];

const stats = [
  { value: '180+', label: 'Active Projects Tracked' },
  { value: '₹900Cr+', label: 'BOQ Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '22%', label: 'Fewer Cost Overruns' },
];

const testimonials = [
  { quote: 'We caught a cement over-consumption issue on Site 4 within two days instead of finding out at month-end. That alone saved us lakhs.', name: 'Rajendra Patil', role: 'Project Manager, Patil Constructions' },
  { quote: 'Labour attendance used to be a register and guesswork. Now every site engineer logs it on their phone and payroll just works.', name: 'Anjali Deshmukh', role: 'Site Engineer, Deshmukh Infra Projects' },
  { quote: 'The Gantt view is the first thing I open every morning. I know exactly which of our 12 sites is at risk before the client calls.', name: 'Suresh Bhandari', role: 'Director of Operations, Bhandari Builders' },
];

export default function ConstructionDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 grid place-items-center">
              <HardHat className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Site<span className="text-amber-600">Control</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/construction/login" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(217,119,6,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full mb-6">
              <HardHat className="w-3.5 h-3.5" /> Trusted by 180+ construction sites across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Catch cost overruns<br />before they <span className="text-amber-600">become expensive.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              BOQ, materials, labour and site progress — tracked in real time from every project, so surprises show up on your screen, not in your final bill.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/construction/login" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1541976590-713941681591?w=900&q=75&auto=format&fit=crop"
                alt="Construction site with crane"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <GanttChartSquare className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-500">Project On Schedule</span>
              </div>
              <div className="text-2xl font-extrabold">91%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '91%' }} />
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
          <div className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how construction sites actually run</h2>
          <p className="text-slate-600">From the estimation desk to the last site engineer — one connected system, no more spreadsheets and phone calls.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-amber-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-amber-600" />
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
            <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for every site</h2>
            <p className="text-slate-400">Real-time budgets, labour, materials and progress — the view your project managers check every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=75&auto=format&fit=crop"
              alt="SiteControl dashboard preview — aerial construction site"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/construction/login" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Trusted By Site Teams</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Builders see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-amber-600 to-amber-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Building2 className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your projects run smoother?</h2>
            <p className="text-amber-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your site and project teams would use, day one.</p>
            <Link href="/demo/construction/login" className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-600" /> SiteControl — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/construction" className="font-semibold text-slate-700 hover:text-amber-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your project" CTA */}
      <Link
        href="/software/construction"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-amber-400" /> Get this for your project
      </Link>
    </div>
  );
}
