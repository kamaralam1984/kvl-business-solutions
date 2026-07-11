import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Brain, MessageSquare, TrendingUp, BarChart3, Target, FileText, Workflow,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Sparkles, Zap, Bot,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'NeuraOps — AI Business Automation Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: MessageSquare, title: 'AI Chatbot + Voice', desc: 'A 24/7 AI agent that answers on chat and voice, quotes prices, and books orders — without a human touching the first message.' },
  { Icon: TrendingUp, title: 'Predictive Analytics', desc: 'Forecast next quarter\'s revenue and demand from your own historical data, refreshed automatically every night.' },
  { Icon: BarChart3, title: 'Auto Reports', desc: 'Weekly and monthly performance reports written and emailed to leadership — zero spreadsheets, zero manual compiling.' },
  { Icon: Target, title: 'Lead Scoring AI', desc: 'Every inbound lead ranked by conversion probability in real time, so your sales team calls the hottest ones first.' },
  { Icon: FileText, title: 'Document AI', desc: 'Invoices, POs and contracts read, extracted and matched automatically — no more retyping numbers by hand.' },
  { Icon: Workflow, title: 'Custom AI Workflows', desc: 'Build no-code automations that trigger on any event — a new lead, a stalled deal, a low-stock alert — and let AI handle the next step.' },
];

const stats = [
  { value: '250+', label: 'Businesses Automated' },
  { value: '8M+', label: 'AI Decisions Made' },
  { value: '99.9%', label: 'Uptime' },
  { value: '70%', label: 'Less Manual Analysis' },
];

const testimonials = [
  { quote: 'Our sales team used to spend Monday mornings building reports. Now NeuraOps has them in their inbox before anyone logs in.', name: 'Karan Bhatia', role: 'Founder, Bhatia Distributors' },
  { quote: 'Lead scoring alone changed how we work — reps stopped chasing cold leads and started closing the ones AI flagged as hot.', name: 'Neha Kapoor', role: 'Head of Operations, Kapoor Retail Group' },
  { quote: 'The AI chatbot handles nearly 60% of our customer queries end-to-end. Our support team now only sees the hard cases.', name: 'Suresh Iyer', role: 'Founder, Iyer Home Appliances' },
];

export default function AIBusinessDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-800 grid place-items-center">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Neura<span className="text-fuchsia-600">Ops</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/ai-business/login" className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(192,38,211,0.10) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Trusted by 250+ businesses automating with AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Stop chasing data.<br />Start acting on <span className="text-fuchsia-600">AI insights.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              NeuraOps scores every lead, predicts your sales trends and writes your reports automatically — so your team spends time closing deals, not digging through spreadsheets.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/ai-business/login" className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-fuchsia-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-fuchsia-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-fuchsia-600" /> Live in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-fuchsia-200/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1555255707-c07966088b7b?w=900&q=75&auto=format&fit=crop"
                alt="AI automation in action"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-fuchsia-600" />
                <span className="text-xs font-semibold text-slate-500">AI Accuracy</span>
              </div>
              <div className="text-2xl font-extrabold">96.4%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-fuchsia-600 to-purple-700 rounded-full" style={{ width: '96%' }} />
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
          <div className="text-xs font-bold tracking-widest text-fuchsia-600 uppercase mb-3">Intelligence, Built In</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">AI that works while your team sleeps</h2>
          <p className="text-slate-600">Six AI systems, one connected platform — every one of them acting on your data around the clock.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-100/60 transition-all">
              <div className="w-11 h-11 rounded-xl bg-fuchsia-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-fuchsia-600" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product preview */}
      <section id="screens" className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(192,38,211,0.25) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your business</h2>
            <p className="text-slate-400">Leads, automations, forecasts and AI-generated insights — the view your leadership checks every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-2xl shadow-fuchsia-900/30">
            <Image
              src="https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=1400&q=75&auto=format&fit=crop"
              alt="NeuraOps dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/ai-business/login" className="inline-flex items-center gap-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-fuchsia-600 uppercase mb-3">Trusted By Growing Businesses</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Teams see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 to-purple-900 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <ShieldCheck className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to let AI run your busywork?</h2>
            <p className="text-fuchsia-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your team would use, day one.</p>
            <Link href="/demo/ai-business/login" className="inline-flex items-center gap-2 bg-white hover:bg-fuchsia-50 text-fuchsia-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-fuchsia-600" /> NeuraOps — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/ai-business" className="font-semibold text-slate-700 hover:text-fuchsia-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your business" CTA */}
      <Link
        href="/software/ai-business"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> Get this for your business
      </Link>
    </div>
  );
}
