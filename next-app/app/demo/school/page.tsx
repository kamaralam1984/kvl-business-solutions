import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap, Smartphone, BookOpen, BadgeIndianRupee, CalendarCheck, Bus, Library,
  Star, ArrowRight, CheckCircle2, TrendingUp, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus360 — School Management Software Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Smartphone, title: 'Parent + Student App', desc: 'Attendance, homework, fee dues and exam results reach every parent\'s phone the moment they\'re recorded — no more missed circulars.' },
  { Icon: BookOpen, title: 'Online Exams', desc: 'Run MCQ and subjective tests online, auto-grade objective sections, and publish results the same day instead of weeks later.' },
  { Icon: BadgeIndianRupee, title: 'Fee Management', desc: 'Collect fees via UPI, card or net banking, auto-generate receipts, and send due-date reminders without a single phone call.' },
  { Icon: CalendarCheck, title: 'Attendance Tracking', desc: 'Biometric or app-based attendance marked in seconds, with instant SMS alerts to parents the moment a child is marked absent.' },
  { Icon: Bus, title: 'Transport Management', desc: 'Live GPS tracking of every school bus, optimized routes, and automatic pickup/drop notifications for anxious parents.' },
  { Icon: Library, title: 'Library Management', desc: 'Digital catalogue with barcode issue/return, due-date reminders and fine tracking — no more lost ledgers.' },
];

const stats = [
  { value: '300+', label: 'Schools Powered' },
  { value: '1.8M+', label: 'Students Managed' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '60%', label: 'Less Admin Paperwork' },
];

const testimonials = [
  { quote: 'Fee collection that used to take our accounts team two weeks now happens automatically online — parents get reminders, we get instant reports.', name: 'Kavita Deshmukh', role: 'Principal, Sunrise Public School, Pune' },
  { quote: 'Parents finally stopped calling the office to ask about attendance. Everything shows up in the app the moment we mark the register.', name: 'Rajesh Iyer', role: 'Administrator, St. Xavier\'s Academy, Nashik' },
  { quote: 'Bus tracking alone justified the cost. Parents can see exactly when the bus will reach their stop, down to the minute.', name: 'Anjali Nair', role: 'Director, Green Valley International School, Coimbatore' },
];

export default function SchoolDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 grid place-items-center">
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Campus<span className="text-violet-600">360</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/school/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> Trusted by 300+ schools across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Run your entire school<br />from <span className="text-violet-600">one platform.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Campus360 handles admissions, fee collection, attendance, exams and transport — so your staff can stop chasing paperwork and start focusing on students.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/school/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-violet-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-violet-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-violet-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=75&auto=format&fit=crop"
                alt="Students in a modern classroom"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <BadgeIndianRupee className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-semibold text-slate-500">Fee Collection Rate</span>
              </div>
              <div className="text-2xl font-extrabold">96.4%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full" style={{ width: '96.4%' }} />
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
          <div className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how schools actually run</h2>
          <p className="text-slate-600">Admissions to transport, one connected system — no more switching between five different registers.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-violet-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-violet-600" />
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
            <div className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your school</h2>
            <p className="text-slate-400">Real-time students, fees, attendance and exams — the view your administrators check every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75&auto=format&fit=crop"
              alt="Campus360 dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/school/login" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-3">Trusted By School Leaders</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Schools see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <GraduationCap className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your school run smoother?</h2>
            <p className="text-violet-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your team would use, day one.</p>
            <Link href="/demo/school/login" className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-violet-600" /> Campus360 — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/school" className="font-semibold text-slate-700 hover:text-violet-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your school" CTA */}
      <Link
        href="/software/school"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <GraduationCap className="w-3.5 h-3.5 text-violet-400" /> Get this for your school
      </Link>
    </div>
  );
}
