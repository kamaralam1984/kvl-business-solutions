import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  BedDouble, CalendarCheck, ClipboardList, Sparkles, Globe2, Link2, Receipt,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Hotel, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'StayManager — Hotel Management Software Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: CalendarCheck, title: 'Reservation Management', desc: 'One calendar for every room, every rate plan and every source — walk-ins, phone bookings and OTAs, all in sync.' },
  { Icon: ClipboardList, title: 'Front Desk Operations', desc: 'Check-in and check-out in under a minute, with folios, ID capture and room assignment handled on one screen.' },
  { Icon: Sparkles, title: 'Housekeeping Module', desc: 'Live room status — Clean, Dirty, Inspected — synced straight from housekeeping staff devices to the front desk.' },
  { Icon: Globe2, title: 'Online Booking Engine', desc: 'A commission-free booking widget for your own website, so direct bookings stop leaking to OTA commissions.' },
  { Icon: Link2, title: 'Channel Manager', desc: 'Rates and availability pushed to MakeMyTrip, Booking.com, Goibibo and Agoda in real time — zero double bookings.' },
  { Icon: Receipt, title: 'Restaurant Billing', desc: 'In-house restaurant and room-service billing posts straight to the guest folio, ready at checkout.' },
];

const stats = [
  { value: '220+', label: 'Hotels & Resorts' },
  { value: '3.2M+', label: 'Bookings Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: 'Zero', label: 'Double Bookings' },
];

const testimonials = [
  { quote: 'We run 64 rooms across two properties and used to reconcile OTA bookings by hand every morning. StayManager’s channel manager alone has saved us close to three hours a day.', name: 'Arvind Bhatia', role: 'General Manager, Meridian Palace, Udaipur' },
  { quote: 'Housekeeping used to call the front desk to confirm every room was ready. Now the status updates live on the same screen the reservations team is looking at.', name: 'Farah Sheikh', role: 'Owner, The Ivory Courtyard, Goa' },
  { quote: 'Direct bookings from our own website have gone up 40% since we switched on the booking engine — and we stopped paying 18% commission on those rooms.', name: 'Karthik Subramaniam', role: 'Director of Operations, Blue Orchid Resorts' },
];

export default function HotelDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-800 grid place-items-center">
              <Hotel className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Stay<span className="text-amber-800">Manager</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/hotel/login" className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(146,64,14,0.09) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full mb-6">
              <BedDouble className="w-3.5 h-3.5" /> Trusted by 220+ hotels &amp; resorts across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Never double-book a room<br />again — <span className="text-amber-800">run it all from one screen.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Front desk, reservations, housekeeping and billing in one system — synced with a channel manager so every OTA and walk-in booking lands in the same calendar, instantly.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/hotel/login" className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-800/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-800" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-800" /> Live in 5 business days</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=75&auto=format&fit=crop"
                alt="Luxury hotel lobby"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <BedDouble className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-semibold text-slate-500">Occupancy Rate</span>
              </div>
              <div className="text-2xl font-extrabold">87.4%</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-800 rounded-full" style={{ width: '87.4%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-amber-50/40">
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
          <div className="text-xs font-bold tracking-widest text-amber-800 uppercase mb-3">Everything In One Place</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how hotels actually run</h2>
          <p className="text-slate-600">Front desk, housekeeping and revenue teams working off the same live data — no more phone calls to confirm a room is ready.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-amber-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-amber-800" />
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
            <div className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your property</h2>
            <p className="text-slate-400">Occupancy, arrivals, housekeeping status and today&apos;s revenue — the view your front desk team checks every morning.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=75&auto=format&fit=crop"
              alt="StayManager dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/hotel/login" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-amber-800 uppercase mb-3">Trusted By Hoteliers</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Properties see the difference in week one</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="rounded-2xl border border-slate-100 p-6 bg-amber-50/30">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}
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
        <div className="rounded-3xl bg-gradient-to-br from-amber-800 to-slate-900 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Hotel className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your property run smoother?</h2>
            <p className="text-amber-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your front desk would use, day one.</p>
            <Link href="/demo/hotel/login" className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-800 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-amber-800" /> StayManager — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo by
            <Link href="/software/hotel" className="font-semibold text-slate-700 hover:text-amber-800 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your hotel" CTA */}
      <Link
        href="/software/hotel"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Get this for your hotel
      </Link>
    </div>
  );
}
