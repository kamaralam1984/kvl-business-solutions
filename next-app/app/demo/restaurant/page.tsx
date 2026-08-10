import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  UtensilsCrossed, Grid3X3, ClipboardList, Receipt, Truck, PackageSearch,
  BarChart2, Star, ArrowRight, CheckCircle2, Flame, Clock, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'DineFlow — Restaurant POS Software Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: Grid3X3, title: 'Table Management', desc: 'Live floor map of every table — seat, merge, split or transfer covers in two taps, no more guessing who\'s free.' },
  { Icon: ClipboardList, title: 'Kitchen Order Ticket', desc: 'Orders fire straight to the kitchen display the moment they\'re placed — no running slips, no missed items.' },
  { Icon: Receipt, title: 'GST Billing', desc: 'One-tap, fully compliant GST invoices with saved tax templates, split bills and instant reprints.' },
  { Icon: Truck, title: 'Swiggy / Zomato Sync', desc: 'Every delivery order from every platform lands in one queue — no more juggling four different tablets.' },
  { Icon: PackageSearch, title: 'Inventory Tracking', desc: 'Recipe-linked stock that deducts automatically per order, with low-stock alerts before you run out mid-service.' },
  { Icon: BarChart2, title: 'Sales Reports', desc: 'Real margins by dish, platform and daypart — know exactly what\'s making money and what\'s eating into it.' },
];

const stats = [
  { value: '1,100+', label: 'Restaurants & Cafes' },
  { value: '45M+', label: 'Orders Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '3x', label: 'Faster Table Turnover' },
];

const testimonials = [
  { quote: 'We used to run five different tablets for Swiggy, Zomato and our own POS. DineFlow put it all in one queue — my kitchen finally has order.', name: 'Rakesh Chhabra', role: 'Owner, Spice Route Kitchen' },
  { quote: 'The KOT used to be a running slip that got lost on a busy Saturday. Now it\'s on a screen in the kitchen the second the waiter taps send.', name: 'Meera Pillai', role: 'Manager, Coastal Curry House' },
  { quote: 'For the first time I can see real margins per dish, not just total sales. We dropped two items that were quietly losing us money every day.', name: 'Vivek Anand', role: 'Founder, Anand\'s Tiffin Co.' },
];

export default function RestaurantDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 grid place-items-center">
              <UtensilsCrossed className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Dine<span className="text-red-600">Flow</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/restaurant/login" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full mb-6">
              <Flame className="w-3.5 h-3.5" /> Trusted by 1,100+ restaurants across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Run dine-in, delivery<br />and kitchen from <span className="text-red-600">one screen.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Tables, kitchen orders, GST billing and every delivery platform — Swiggy, Zomato and more — unified into one system, with full visibility into your real margins.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/restaurant/login" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-600" /> Setup in 48 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=75&auto=format&fit=crop"
                alt="Restaurant dining floor"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-slate-500">Today&apos;s Orders</span>
              </div>
              <div className="text-2xl font-extrabold">186</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '74%' }} />
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
          <div className="text-xs font-bold tracking-widest text-red-600 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how restaurants actually run</h2>
          <p className="text-slate-600">Front of house, kitchen and delivery — one connected system, no more switching between five different apps.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-red-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-red-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-red-600" />
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
            <div className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your restaurant</h2>
            <p className="text-slate-400">Real-time tables, orders, kitchen queue and revenue — the view your manager checks every shift.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=75&auto=format&fit=crop"
              alt="DineFlow dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/restaurant/login" className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-red-600 uppercase mb-3">Trusted By Restaurant Owners</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Restaurants see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <UtensilsCrossed className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your restaurant run smoother?</h2>
            <p className="text-red-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your staff would use, day one.</p>
            <Link href="/demo/restaurant/login" className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-red-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-red-600" /> DineFlow — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/restaurant" className="font-semibold text-slate-700 hover:text-red-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your restaurant" CTA */}
      <Link
        href="/software/restaurant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <Clock className="w-3.5 h-3.5 text-red-400" /> Get this for your restaurant
      </Link>
    </div>
  );
}
