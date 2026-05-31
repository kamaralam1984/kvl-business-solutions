'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Route, Shield, BarChart2, Radio } from 'lucide-react';

const features = [
  { icon: MapPin, label: 'Real-time vehicle location & speed' },
  { icon: Route, label: 'Full route history & trip playback' },
  { icon: Shield, label: 'Geofence alerts & zone violations' },
  { icon: BarChart2, label: 'Live reports & driver analytics' },
];

function MapVisual() {
  return (
    <div className="space-y-4">
      {/* Truck hero image */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 160 }}
      >
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80&auto=format&fit=crop"
          alt="Commercial fleet vehicles"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(6,13,31,0.75) 0%, rgba(6,13,31,0.2) 60%, transparent 100%)',
          }}
        />
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(8px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            FLEET LIVE
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
          <div className="text-[13px] font-bold text-white">24 Vehicles Tracked</div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Avg Speed: 54 km/h</div>
        </div>
      </div>

      {/* Dashboard mockup frame */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#060d1f',
          border: '1px solid rgba(255,255,255,0.07)',
          minHeight: 300,
        }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#04080f' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="text-[11px] ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
            KVL Fleet Dashboard
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* GPS dashboard screenshot image */}
        <div className="relative" style={{ height: 160 }}>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop"
            alt="GPS dashboard analytics"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
          {/* Map overlay */}
          <div className="absolute inset-0">
            {/* Grid lines */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Road path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
              <path
                d="M 40 130 Q 120 100 180 70 Q 240 40 300 55 Q 350 65 380 45"
                fill="none"
                stroke="rgba(200,168,112,0.2)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <path
                d="M 40 130 Q 120 100 180 70 Q 240 40 300 55 Q 350 65 380 45"
                fill="none"
                stroke="rgba(200,168,112,0.5)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Vehicle dots */}
            <div className="absolute" style={{ top: '42%', left: '44%' }}>
              <div className="relative">
                <div
                  className="absolute -inset-3 rounded-full animate-ping"
                  style={{ background: 'rgba(34,197,94,0.15)' }}
                />
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{ background: '#22c55e', borderColor: '#fff' }}
                />
              </div>
            </div>
            <div className="absolute" style={{ top: '62%', left: '22%' }}>
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ background: '#f59e0b', borderColor: '#fff' }}
              />
            </div>
            <div className="absolute" style={{ top: '28%', left: '72%' }}>
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ background: '#3b82f6', borderColor: '#fff' }}
              />
            </div>
            <div className="absolute" style={{ top: '70%', left: '60%' }}>
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ background: '#22c55e', borderColor: '#fff' }}
              />
            </div>

            {/* Geofence zone */}
            <div
              className="absolute rounded-full"
              style={{
                top: '25%', left: '38%', width: 90, height: 60,
                border: '1px dashed rgba(200,168,112,0.35)',
                background: 'rgba(200,168,112,0.04)',
              }}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="grid grid-cols-3 divide-x"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', divideColor: 'rgba(255,255,255,0.05)' }}
        >
          {[
            { label: 'Vehicles Tracked', value: '24' },
            { label: 'Active Alerts', value: '3' },
            { label: 'Avg Speed', value: '54 km/h' },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[15px] font-bold text-white leading-none mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GpsTracking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'rgb(var(--bg-2))' }}
    >
      {/* Truck background image at low opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgb(var(--bg-2))', opacity: 0.82 }} />
      </div>

      <div className="divider-gold" style={{ position: 'relative', zIndex: 1 }} />

      <div className="container" ref={ref} style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="eyebrow block mb-4">GPS & FLEET MANAGEMENT</span>

            <h2
              className="font-display font-black leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', color: '#f8f8f6' }}
            >
              Track Every Vehicle.{' '}
              <br />
              In Real Time.
            </h2>

            <p
              className="text-[15px] leading-[1.75] mb-8 max-w-md"
              style={{ color: '#888' }}
            >
              Monitor your entire fleet from a single dashboard. Get instant alerts,
              route history, and performance analytics — from any device, anywhere.
            </p>

            {/* Feature list */}
            <ul className="space-y-4 mb-10">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.label} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full grid place-items-center shrink-0 text-[11px] font-black"
                      style={{ background: 'rgba(200,168,112,0.15)', color: '#c8a870' }}
                    >
                      ✓
                    </span>
                    <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {f.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link href="/services" className="btn-primary inline-flex items-center gap-2">
              Explore GPS Tracking
              <Radio className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <MapVisual />
          </motion.div>

        </div>
      </div>

      <div className="divider-gold mt-24" style={{ position: 'relative', zIndex: 1 }} />
    </section>
  );
}
