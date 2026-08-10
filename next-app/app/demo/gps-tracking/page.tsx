import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Satellite, MapPin, Bell, Smartphone, Route, Gauge, Fuel,
  ShieldCheck, Star, ArrowRight, CheckCircle2, Truck, Zap, Radar,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FleetPulse — GPS Fleet Tracking Demo',
  robots: { index: false, follow: false },
};

const features = [
  { Icon: MapPin, title: 'Real-Time Location', desc: 'Every vehicle, every driver, updated every few seconds on one live map — no more calling drivers to ask where they are.' },
  { Icon: Radar, title: 'Geofence Alerts', desc: 'Draw a boundary around a yard, route or customer site and get an instant alert the moment a vehicle enters or exits.' },
  { Icon: Smartphone, title: 'Mobile App', desc: 'Drivers and dispatchers see the same live picture on Android and iOS — no separate hardware terminal required.' },
  { Icon: Route, title: 'Route History', desc: 'Full playback of any trip — stops, halts, detours and speed, stored and searchable for 180 days.' },
  { Icon: Gauge, title: 'Driver Behaviour', desc: 'Harsh braking, rash acceleration and overspeeding scored automatically, so coaching is based on data, not guesswork.' },
  { Icon: Fuel, title: 'Fuel Monitoring', desc: 'Sensor-linked fuel level tracking flags theft and pilferage the moment a tank drops without a matching stop.' },
];

const stats = [
  { value: '5,000+', label: 'Vehicles Tracked' },
  { value: '40+', label: 'Fleet Operators' },
  { value: '99.9%', label: 'GPS Uptime' },
  { value: '18%', label: 'Avg. Fuel Savings' },
];

const testimonials = [
  { quote: 'We used to lose an hour every morning just figuring out where trucks were. Now the whole yard is visible before the first cup of chai.', name: 'Rajeev Malhotra', role: 'Fleet Manager, Malhotra Roadlines' },
  { quote: 'Geofence alerts caught two drivers taking unauthorised detours in the first week. The system paid for itself in fuel saved alone.', name: 'Anita Krishnan', role: 'Operations Head, Krishnan Logistics' },
  { quote: 'Customers used to call asking where their shipment was. Now we send them the live tracking link before they even ask.', name: 'Suresh Pillai', role: 'Director, Pillai Freight Carriers' },
];

export default function GpsTrackingDemoLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 grid place-items-center">
              <Satellite className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Fleet<span className="text-orange-600">Pulse</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#screens" className="hover:text-slate-900">Product</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
          </nav>
          <Link href="/demo/gps-tracking/login" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(234,88,12,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full mb-6">
              <Satellite className="w-3.5 h-3.5" /> Trusted by 40+ fleet operators across India
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Know where every vehicle<br />is, <span className="text-orange-600">always.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Live GPS tracking that gives fleet managers real-time vehicle visibility, route history and geofence alerts — so assets stay accounted for and fuel costs stay in check.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/demo/gps-tracking/login" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-600/20">
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-orange-600" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-orange-600" /> Installed in 24 hours</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=75&auto=format&fit=crop"
                alt="Fleet trucks on the highway"
                width={900}
                height={650}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-semibold text-slate-500">Vehicles Live Now</span>
              </div>
              <div className="text-2xl font-extrabold">1,842</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: '76%' }} />
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
          <div className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-3">Full Fleet Visibility</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Built for how fleets actually run</h2>
          <p className="text-slate-600">One live map for dispatch, drivers and customers — no more chasing vehicles over phone calls.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-slate-100 p-6 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-50 grid place-items-center mb-4">
                <f.Icon className="w-5 h-5 text-orange-600" />
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
            <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">See It In Action</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">A live command center for your fleet</h2>
            <p className="text-slate-400">Live positions, geofence alerts, fuel levels and driver scores — the view dispatch checks all day, every day.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1400&q=75&auto=format&fit=crop"
              alt="FleetPulse dashboard preview"
              width={1400}
              height={780}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/demo/gps-tracking/login" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Try The Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-3">Trusted By Fleet Owners</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Fleets see the difference in week one</h2>
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
        <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <ShieldCheck className="w-10 h-10 text-white/90 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to see your fleet, live?</h2>
            <p className="text-orange-50 mb-8 max-w-xl mx-auto">Explore the live dashboard — no signup, no waiting. See exactly what your dispatch team would use, day one.</p>
            <Link href="/demo/gps-tracking/login" className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-bold px-7 py-3.5 rounded-xl transition-colors">
              <Zap className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-orange-600" /> FleetPulse — a demo product
          </div>
          <div className="flex items-center gap-1.5">
            Demo built by
            <Link href="/software/gps-tracking" className="font-semibold text-slate-700 hover:text-orange-600 inline-flex items-center gap-1">
              KVL Business Solutions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating "get this for your fleet" CTA */}
      <Link
        href="/software/gps-tracking"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
      >
        <Bell className="w-3.5 h-3.5 text-orange-400" /> Get this for your fleet
      </Link>
    </div>
  );
}
