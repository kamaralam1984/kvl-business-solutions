import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity, HeartPulse, Stethoscope, Pill, FlaskConical, CalendarClock,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Bed, Users, FileText, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'VitalCare HMS — Hospital Management Software Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Users, title: 'OPD Queue Management', desc: 'Token-based patient check-in with live wait times, so reception never becomes a bottleneck.' },
  { Icon: Bed, title: 'IPD & Bed Management', desc: 'Real-time bed occupancy across wards — admit, transfer and discharge without a single phone call.' },
  { Icon: FileText, title: 'EMR / EHR', desc: 'One longitudinal patient record — history, vitals, prescriptions and reports, accessible to every department.' },
  { Icon: Pill, title: 'Pharmacy Module', desc: 'Stock-linked prescriptions with auto low-stock alerts and expiry tracking, right at the billing counter.' },
  { Icon: FlaskConical, title: 'Lab Integration', desc: 'Orders flow straight to the lab; results post back to the patient record the moment they\'re signed off.' },
  { Icon: ShieldCheck, title: 'Insurance & Claims', desc: 'Cashless claim workflows with TPA tracking, so approvals stop living in someone\'s inbox.' },
];

const stats = [
  { value: '120+', label: 'Hospitals & Clinics' },
  { value: '4.2M+', label: 'Patient Records Managed' },
  { value: '99.95%', label: 'Uptime SLA' },
  { value: '< 2 min', label: 'Avg. OPD Check-in Time' },
];

const testimonials = [
  { quote: 'Our OPD wait times dropped by half in the first month. Doctors finally see patients instead of paperwork.', name: 'Dr. Ashok Verma', role: 'Medical Director, City Care Hospital' },
  { quote: 'Bed occupancy used to be a whiteboard and a prayer. Now it\'s live, accurate, and everyone sees the same number.', name: 'Sunita Rao', role: 'Nursing Superintendent, Sanjeevani Multi-Speciality' },
  { quote: 'Insurance claims that took 3 weeks now clear in 4 days. The TPA dashboard alone paid for the system.', name: 'Manoj Kher', role: 'Administrator, Lifeline Hospitals' },
];

export default function HospitalDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 grid place-items-center">
              <HeartPulse className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">VitalCare<span className="text-teal-600">HMS</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/hospital/login" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(13,148,136,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full mb-6">
              <Activity className="w-3.5 h-3.5" /> Trusted by 120+ hospitals across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Run your entire hospital<br />from <span className="text-teal-600">one screen.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              OPD, IPD, pharmacy, lab and billing — unified into one patient record, so your care teams spend time on patients, not paperwork.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/hospital/login" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=75&auto=format&fit=crop"
                alt="Hospital care team"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-slate-500">Bed Occupancy</span>
              </div>
              <div className="text-2xl font-extrabold">82%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '82%' }} />
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
          <div className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how hospitals actually run</h2>
          <p className="text-slate-600">Every department, one connected system — no more switching between five different tools.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-teal-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-teal-600" />
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
            <div className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your hospital</h2>
            <p className="text-slate-400">Real-time patients, beds, revenue and lab reports — the view your administrators check every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&q=75&auto=format&fit=crop"
              alt="VitalCare dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/hospital/login" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">Trusted By Care Teams</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Hospitals see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Stethoscope className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your hospital run smoother?</h2>
            <p className="text-teal-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your team would use, day one.</p>
            <Link href="/demo/hospital/login" className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" /> VitalCare HMS — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/hospital" className="font-semibold text-slate-700 hover:text-teal-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your hospital" CTA */}
      <Link
        href="/software/hospital"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <CalendarClock className="w-3.5 h-3.5 text-teal-400" /> Get this for your hospital
      </Link>
    </div>
  );
}
