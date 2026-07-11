import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Target,
  ArrowRight,
  GitBranch,
  MessageCircle,
  BarChart3,
  Smartphone,
  Users,
  CheckCircle2,
  Star,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PulseCRM — Sales CRM Demo',
  robots: { index: false, follow: false },
};

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Visual Sales Pipeline',
    desc: 'Drag-and-drop deals from first contact to signed contract, so every rep always knows exactly what to chase next.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp & Email Automation',
    desc: 'Automatic WhatsApp and email follow-ups fire the moment a lead goes quiet — nobody ever falls through the cracks.',
  },
  {
    icon: Target,
    title: 'AI Lead Scoring',
    desc: 'Every lead is ranked by intent and buying signals, so your team spends time on deals that are actually going to close.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Real-time pipeline value, conversion rates and rep performance — all in one clean, live dashboard.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    desc: 'Update deals, log calls and message leads from the field — built for reps who live on the road.',
  },
  {
    icon: Users,
    title: 'Team Management',
    desc: 'Assign territories, set monthly targets and track quota attainment for every rep on your team.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Our follow-up rate went from total chaos to 100% inside two weeks. We haven’t lost a single hot lead to a full inbox since we switched.',
    name: 'Rohan Deshmukh',
    role: 'Sales Head, Meridian Realty Group',
    initials: 'RD',
  },
  {
    quote:
      'Lead scoring alone paid for itself in the first month. My reps stopped wasting hours on dead leads and started closing the ones that mattered.',
    name: 'Ayesha Khan',
    role: 'VP Sales, Northbridge Fintech',
    initials: 'AK',
  },
  {
    quote:
      'The WhatsApp automation is built for how Indian buyers actually communicate. Our response time dropped from hours to minutes.',
    name: 'Vikram Rao',
    role: 'Founder, Coastline Logistics',
    initials: 'VR',
  },
];

export default function CrmDemoLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/demo/crm" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <Target className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">PulseCRM</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-rose-600">Features</a>
            <a href="#product" className="hover:text-rose-600">Product</a>
            <a href="#customers" className="hover:text-rose-600">Customers</a>
          </nav>
          <Link
            href="/demo/crm/login"
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            View Live Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700">
              <TrendingUp className="h-3.5 w-3.5" />
              AI-Powered Sales CRM
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Close More Deals, Faster —{' '}
              <span className="text-rose-600">Never Lose a Lead Again</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              PulseCRM captures every lead, scores it by buying intent, and automates
              WhatsApp &amp; email follow-ups so your sales team closes more, faster —
              with nothing slipping through a full inbox.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/demo/crm/login"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
              >
                View Live Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
              >
                See Features
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['SR', 'PM', 'AK', 'VN'].map((i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-rose-100 text-[11px] font-semibold text-rose-700"
                  >
                    {i}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Trusted by <span className="font-semibold text-slate-700">800+ sales teams</span> across India
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80"
                alt="Sales team reviewing pipeline together in a meeting"
                width={1200}
                height={900}
                className="h-[420px] w-full object-cover md:h-[480px]"
                priority
              />
            </div>
            <div className="absolute -bottom-8 -left-6 w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:-left-10">
              <p className="text-xs font-medium text-slate-500">Deals Closed This Month</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">128 / 156</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-rose-600" style={{ width: '82%' }} />
              </div>
              <p className="mt-2 text-xs font-semibold text-emerald-600">82% of quarterly target</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-rose-50/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {[
            ['800+', 'Sales Teams'],
            ['2.1M+', 'Leads Managed'],
            ['99.9%', 'Uptime'],
            ['3x', 'Faster Follow-ups'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-rose-600 md:text-4xl">{value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Everything Your Sales Team Needs
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From first click to signed contract — PulseCRM keeps every lead, deal and
            follow-up organized in one place.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <f.icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product preview - dark */}
      <section id="product" className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              See Your Entire Pipeline in One Screen
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Every lead, every deal stage, every follow-up due today — surfaced live,
              the moment your reps log in.
            </p>
          </div>
          <div className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Image
              src="/demo/crm-dashboard-mockup.png"
              alt="PulseCRM analytics dashboard shown on a laptop screen"
              width={1500}
              height={1057}
              className="h-[380px] w-full object-cover md:h-[520px]"
            />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/demo/crm/login"
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500"
            >
              Launch Live Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Sales Teams Trust PulseCRM
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Real results from real sales organizations across India.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex gap-0.5 text-rose-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-rose-500 text-rose-500" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-rose-800 px-8 py-16 text-center shadow-xl md:px-16">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Ready to Close More Deals?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-rose-50">
            Walk through a fully live PulseCRM workspace — real pipeline, real
            automation, zero setup.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/crm/login"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-rose-700 shadow-lg transition hover:bg-rose-50"
            >
              Launch Live Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-100">
              <CheckCircle2 className="h-4 w-4" />
              No signup required
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <p>&copy; 2026 PulseCRM. This is a product demo experience.</p>
          <Link href="/software/crm" className="font-semibold text-rose-600 hover:text-rose-700">
            Demo by KVL Business Solutions
          </Link>
        </div>
      </footer>

      {/* Floating pill */}
      <Link
        href="/software/crm"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-rose-600"
      >
        Get this for your sales team
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
