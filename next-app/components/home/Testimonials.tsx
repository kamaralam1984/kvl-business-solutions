'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const companyImages = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=60&auto=format&fit=crop',
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Managing Director',
    company: 'Sharma Enterprises',
    location: 'Pune',
    color: '#c8a870',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&q=80&auto=format&fit=facearea&facepad=3',
    quote:
      'KVL transformed our entire operation with a custom ERP system. What used to take our team 3 full days now takes just 2 hours. The ROI was visible within the first month.',
    metric: '3 days → 2 hrs',
    metricLabel: 'Processing time',
  },
  {
    name: 'Priya Mehta',
    role: 'Director',
    company: 'Green Valley School',
    location: 'Nashik',
    color: '#22c55e',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&q=80&auto=format&fit=facearea&facepad=3',
    quote:
      'The school management system is genuinely outstanding. Parent communication, fee collection, attendance tracking — all unified in one beautiful platform. Parents love it.',
    metric: '100%',
    metricLabel: 'Parent adoption',
  },
  {
    name: 'Anil Patil',
    role: 'CEO',
    company: 'Metro Logistics',
    location: 'Bangalore',
    color: '#3b82f6',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&q=80&auto=format&fit=facearea&facepad=3',
    quote:
      'GPS fleet tracking helped us cut fuel costs by 28% and improve delivery times across all our routes. The real-time dashboard gives us complete visibility. Highly recommended.',
    metric: '↓ 28%',
    metricLabel: 'Fuel cost saved',
  },
  {
    name: 'Sunita Verma',
    role: 'Owner',
    company: 'Verma Fabrication',
    location: 'Aurangabad',
    color: '#f97316',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&q=80&auto=format&fit=facearea&facepad=3',
    quote:
      'Their industrial automation solution literally doubled our production output in three months. The KVL team is always available — they treat your business like their own.',
    metric: '2× output',
    metricLabel: 'Production capacity',
  },
  {
    name: 'Vikram Singh',
    role: 'Principal',
    company: 'Sunrise Academy',
    location: 'Mumbai',
    color: '#a855f7',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&q=80&auto=format&fit=facearea&facepad=3',
    quote:
      'An excellent website that brought us 3× more student inquiries in the first quarter. Clean, blazing fast, and the inquiry form actually converts. Couldn\'t be happier.',
    metric: '3×',
    metricLabel: 'Inquiry growth',
  },
];

export function Testimonials() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(i => (i + 1) % testimonials.length);
    }, 5500);
  };

  const goTo = (i: number) => {
    setActive(i);
    startInterval();
  };

  useEffect(() => {
    if (!paused) startInterval();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const t = testimonials[active];

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'rgb(var(--bg-3))' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,168,112,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">Client Stories</span>
          <h2 className="heading-xl mb-4" style={{ color: '#0a0a0a' }}>
            Trusted by <span style={{ color: '#c8a870' }}>1,200+ businesses</span><br />
            across India
          </h2>
          <p className="text-[15px]" style={{ color: 'rgba(0,0,0,0.45)', maxWidth: 440, margin: '0 auto' }}>
            Real results from real clients — not testimonials written by marketing.
          </p>
        </motion.div>

        {/* Carousel + side thumbnails */}
        <div
          className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-10 overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              }}
            >
              {/* Company environment background image at very low opacity */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${companyImages[active]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.04,
                }}
                aria-hidden
              />

              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${t.color}60 50%, transparent 100%)` }} />

              {/* Large quote mark */}
              <div className="font-display font-black text-[5rem] leading-none mb-2 -mt-2 relative z-10"
                style={{ color: `${t.color}20`, lineHeight: 0.8 }}>&ldquo;</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5 relative z-10">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#c8a870' }} />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-[16px] leading-[1.85] mb-8 relative z-10" style={{ color: 'rgba(0,0,0,0.7)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author row */}
              <div className="flex items-center justify-between pt-5 relative z-10"
                style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid ${t.color}`, boxShadow: `0 0 16px ${t.color}40` }}
                  />
                  <div>
                    <div className="font-semibold text-[14px] leading-tight" style={{ color: '#0a0a0a' }}>{t.name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
                      {t.role}
                    </div>
                    <span
                      className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mt-1"
                      style={{
                        background: `${t.color}18`,
                        color: t.color,
                        border: `1px solid ${t.color}30`,
                      }}
                    >
                      {t.company} · {t.location}
                    </span>
                  </div>
                </div>

                {/* Result metric */}
                <div className="text-right hidden sm:block">
                  <div className="font-black text-[1.3rem] leading-none" style={{ color: t.color }}>
                    {t.metric}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>
                    {t.metricLabel}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side thumbnail list */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {testimonials.map((item, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left shrink-0 lg:shrink transition-all duration-200"
                style={{
                  background: i === active ? 'rgba(0,0,0,0.03)' : 'transparent',
                  border: `1px solid ${i === active ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)'}`,
                  opacity: i === active ? 1 : 0.55,
                }}
              >
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  style={{ border: `1.5px solid ${item.color}`, boxShadow: i === active ? `0 0 8px ${item.color}50` : 'none' }}
                />
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold leading-tight truncate" style={{ color: '#0a0a0a' }}>{item.name}</div>
                  <div className="text-[11px] truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>{item.company}</div>
                </div>
                {i === active && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 ml-auto"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 24 : 7,
                height: 7,
                background: i === active ? '#c8a870' : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
