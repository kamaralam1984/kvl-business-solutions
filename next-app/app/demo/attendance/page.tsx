import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Fingerprint, MapPin, Clock, CalendarCheck, Timer, BarChart2,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Users, Zap, CalendarClock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TimeTrack — Attendance System Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Fingerprint, title: 'Face / Biometric Support', desc: 'Face recognition and fingerprint punch-in — no buddy punching, no manual registers, ever again.' },
  { Icon: MapPin, title: 'Geo-Fenced Mobile', desc: 'Field and remote staff check in from their phone inside a defined radius, with GPS stamped on every entry.' },
  { Icon: Clock, title: 'Shift Management', desc: 'Rotating shifts, split shifts and roster templates — assign once, and TimeTrack handles the rest every week.' },
  { Icon: CalendarCheck, title: 'Leave Tracking', desc: 'Leave balances, approvals and holiday calendars in one place — no more spreadsheet reconciliation at month end.' },
  { Icon: Timer, title: 'Overtime Calculation', desc: 'Auto-computed overtime against shift rules, ready to push straight into payroll without manual adjustment.' },
  { Icon: BarChart2, title: 'Reports & Analytics', desc: 'Attendance, punctuality and overtime trends by department — export payroll-ready reports in one click.' },
];

const stats = [
  { value: '700+', label: 'Companies On TimeTrack' },
  { value: '220K+', label: 'Employees Tracked Daily' },
  { value: '99.9%', label: 'Uptime' },
  { value: 'Zero', label: 'Attendance Disputes' },
];

const testimonials = [
  { quote: 'Payroll used to take three days of cross-checking manual registers. Now it’s a same-day export, and nobody argues about their hours anymore.', name: 'Priya Nair', role: 'HR Manager, Meridian Textiles Pvt Ltd' },
  { quote: 'Our field crews check in by geo-fence from the site. No more calls asking who actually showed up today — the dashboard just tells us.', name: 'Rakesh Ahluwalia', role: 'Operations Head, Skyline Logistics' },
  { quote: 'Overtime disputes were our biggest HR headache. TimeTrack calculates it automatically against our shift rules — that argument is simply gone.', name: 'Sanjana Iyer', role: 'HR Director, Vertex Manufacturing' },
];

export default function AttendanceDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-700 grid place-items-center">
              <Fingerprint className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Time<span className="text-slate-700">Track</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/attendance/login" className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(51,65,85,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full mb-6">
              <ShieldCheck className="w-3.5 h-3.5" /> Trusted by 700+ companies across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              End attendance disputes<br /><span className="text-slate-700">forever.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Biometric and mobile attendance software that replaces manual registers with accurate shift, leave and overtime tracking — payroll-ready data, no disputes over hours worked.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/attendance/login" className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-700/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=75&auto=format&fit=crop"
                alt="Office team checking in for work"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-500">On-Time Today</span>
              </div>
              <div className="text-2xl font-extrabold">94%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
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
          <div className="text-xs font-bold tracking-widest text-slate-700 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how attendance actually happens</h2>
          <p className="text-slate-600">Factory floor, field crews or head office — one system captures accurate hours for every kind of workforce.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-slate-100 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-slate-700" />
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
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your workforce</h2>
            <p className="text-slate-400">Real-time attendance, leave requests and shift coverage — the view your HR team checks every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75&auto=format&fit=crop"
              alt="TimeTrack dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/attendance/login" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-slate-700 uppercase mb-3">Trusted By HR Teams</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Companies see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Users className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your workforce run smoother?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your HR team would use, day one.</p>
            <Link href="/demo/attendance/login" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-700" /> TimeTrack — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/attendance" className="font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your team" CTA */}
      <Link
        href="/software/attendance"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-emerald-400" /> Get this for your team
      </Link>
    </div>
  );
}
