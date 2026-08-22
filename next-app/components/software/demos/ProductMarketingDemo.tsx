'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  X, CheckCircle2, ArrowRight, MessageCircle, Lock,
  AlertTriangle, ArrowDownCircle, ArrowUpCircle, BadgeIndianRupee, BarChart2, Bed, BedDouble, Bell,
  BookOpen, Boxes, Brain, Briefcase, Building2, CalendarCheck, CalendarClock, CalendarDays, CalendarOff,
  CalendarX2, ChefHat, ClipboardCheck, ClipboardList, Clock, Cloud, Code2, Cog, CreditCard, DollarSign,
  Eye, FileCheck, FileText, Fingerprint, FlaskConical, Fuel, GitBranch, Globe, GraduationCap, Grid3X3,
  Handshake, HardHat, Headphones, Home, Hotel, Layers, LayoutDashboard, LayoutGrid, Map, MapPin,
  MessageSquare, Navigation, Network, Package, PackageCheck, Pill, Receipt, Rocket, Route, Satellite,
  ScanLine, Search, Settings, ShieldAlert, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Sparkles,
  Stethoscope, Target, TrendingDown, TrendingUp, Truck, Users, UtensilsCrossed, Warehouse, Wrench, Zap,
} from 'lucide-react';
import type { Software } from '@/lib/data/software';
import { themeForSlug, effectsForSlug, metalGradient, goldGradient, KIT_FOREGROUND, KIT_MUTED } from '@/lib/data/theme-kits';
import { cropVariant } from '@/lib/data/img';
import { EffectSlider, EffectGallery } from './GalleryEffects';
import { DemoContent } from './DemoContent';

// A namespace import (`import * as LucideIcons`) pulls the ENTIRE icon
// library into this client bundle and defeats next.config.js's
// `optimizePackageImports` tree-shaking — this was the single biggest
// contributor to /software/[slug]/demo being the heaviest route in the app.
// Every icon name that actually appears in lib/data/software.ts's
// keyFeatures is imported by name above instead, so only those ~75 icons
// (not the full ~1600-icon set) ship to the browser.
const Icons: Record<string, LucideIcon> = {
  AlertTriangle, ArrowDownCircle, ArrowUpCircle, BadgeIndianRupee, BarChart2, Bed, BedDouble, Bell,
  BookOpen, Boxes, Brain, Briefcase, Building2, CalendarCheck, CalendarClock, CalendarDays, CalendarOff,
  CalendarX2, ChefHat, ClipboardCheck, ClipboardList, Clock, Cloud, Code2, Cog, CreditCard, DollarSign,
  Eye, FileCheck, FileText, Fingerprint, FlaskConical, Fuel, GitBranch, Globe, GraduationCap, Grid3X3,
  Handshake, HardHat, Headphones, Home, Hotel, Layers, LayoutDashboard, LayoutGrid, Map, MapPin,
  MessageSquare, Navigation, Network, Package, PackageCheck, Pill, Receipt, Rocket, Route, Satellite,
  ScanLine, Search, Settings, ShieldAlert, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Sparkles,
  Stethoscope, Target, TrendingDown, TrendingUp, Truck, Users, UtensilsCrossed, Warehouse, Wrench, Zap,
};
const Icon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const Cmp = Icons[name] || Sparkles;
  return <Cmp className={className} style={style} />;
};

const fade = { hidden: { opacity: 0, y: 20 }, show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }) };

export function ProductMarketingDemo({ product }: { product: Software }) {
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
  const theme = themeForSlug(product.slug);
  const { sliderEffect, galleryEffect } = effectsForSlug(product.slug);
  const metal = metalGradient(theme.metal);
  const gold = goldGradient();
  const heroFrames = [
    cropVariant(product.image, 1000, 700, 'entropy'),
    cropVariant(product.image, 1000, 700, 'top'),
    cropVariant(product.image, 1000, 700, 'bottom'),
  ];
  const galleryImages = [
    cropVariant(product.image, 400, 400, 'entropy'),
    cropVariant(product.image, 400, 500, 'top'),
    cropVariant(product.image, 500, 400, 'right'),
    cropVariant(product.image, 400, 400, 'left'),
    cropVariant(product.image, 400, 500, 'bottom'),
  ];

  return (
    <div className="min-h-screen" style={{ background: theme.bg, color: KIT_FOREGROUND }}>
      <style jsx>{`
        .kit-shine { position: relative; overflow: hidden; }
        .kit-shine::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%);
          transform: translateX(-130%) skewX(-18deg);
          animation: kitIdleShine 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes kitIdleShine { 0% { transform: translateX(-130%) skewX(-18deg); } 38% { transform: translateX(230%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
        .kit-breathe { animation: kitBreathe 4s ease-in-out infinite; }
        @keyframes kitBreathe { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); } 50% { box-shadow: 0 0 20px -4px ${theme.metal[1]}55; } }
        .kit-line::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background-image: linear-gradient(90deg, transparent, ${theme.metal[1]}4d 25%, ${theme.metal[0]} 50%, ${theme.metal[1]}4d 75%, transparent);
          background-size: 250% 100%; background-position: 200% 0;
          animation: kitLineShine 4s linear infinite;
        }
        @keyframes kitLineShine { to { background-position: -200% 0; } }
      `}</style>

      {/* Demo banner — no pricing, this is a product preview only */}
      <div className="z-50 text-center py-2 px-4 text-[11px] font-semibold flex items-center justify-center gap-3 flex-wrap" style={{ background: metal, color: theme.metalInk }}>
        <span>🎯 DEMO PREVIEW — {product.name} · {theme.name} theme. Explore freely, this is a preview build.</span>
        <div className="flex items-center gap-2">
          <a href="#dashboard" className="flex items-center gap-1 bg-black/15 border border-black/20 px-3 py-0.5 rounded-full text-[10px] font-bold hover:bg-black/25 transition">
            <Lock className="w-3 h-3" /> Dashboard Preview
          </a>
          <Link href={`/checkout?product=${product.slug}&host=cloud`} className="kit-shine px-3 py-0.5 rounded-full text-[10px] font-bold" style={{ background: gold, color: '#2a1d05' }}>
            Advance Payment
          </Link>
          <Link href={`/software/${product.slug}`} className="opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></Link>
        </div>
      </div>

      {/* Sticky in-page nav */}
      <div className="sticky top-0 z-40 backdrop-blur border-b px-5 py-3 flex items-center justify-between" style={{ background: `${theme.bg}e6`, borderColor: theme.border }}>
        <div className="flex items-center gap-2">
          <div className="kit-shine w-8 h-8 rounded-lg grid place-items-center" style={{ background: metal, color: theme.metalInk }}>
            <Icon name={product.icon} className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm" style={{ color: KIT_FOREGROUND }}>{product.name}</span>
        </div>
        <nav className="hidden sm:flex items-center gap-5 text-xs font-semibold" style={{ color: KIT_MUTED }}>
          <a href="#features" className="hover:opacity-80 transition" style={{ color: KIT_FOREGROUND }}>Features</a>
          <a href="#gallery" className="hover:opacity-80 transition" style={{ color: KIT_FOREGROUND }}>Gallery</a>
          <a href="#dashboard" className="hover:opacity-80 transition" style={{ color: KIT_FOREGROUND }}>Dashboard</a>
          <a href="#why-us" className="hover:opacity-80 transition" style={{ color: KIT_FOREGROUND }}>Why Choose Us</a>
        </nav>
        <a href="#cta" className="kit-shine text-[11px] font-bold px-3.5 py-1.5 rounded-full" style={{ background: metal, color: theme.metalInk }}>Advance Payment</a>
      </div>

      {/* Hero */}
      <section id="hero" className="px-5 sm:px-10 py-12 sm:py-16 grid gap-10 sm:grid-cols-2 items-center max-w-6xl mx-auto">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          {product.tag && (
            <motion.span variants={fade} custom={0.3} initial="hidden" animate="show" className="kit-shine inline-block text-[10px] font-bold px-3 py-1 rounded-full mb-4" style={{ background: gold, color: '#2a1d05' }}>
              {product.tag}
            </motion.span>
          )}
          <motion.h1 variants={fade} custom={0.6} initial="hidden" animate="show" className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4" style={{ color: KIT_FOREGROUND }}>{product.name}</motion.h1>
          <motion.p variants={fade} custom={0.9} initial="hidden" animate="show" className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: KIT_MUTED }}>{product.description}</motion.p>
          <motion.div variants={fade} custom={1.2} initial="hidden" animate="show" className="flex gap-3 flex-wrap">
            <a href="#dashboard" className="kit-shine flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg" style={{ background: metal, color: theme.metalInk }}>
              See Live Dashboard <ArrowRight className="w-4 h-4" />
            </a>
            <Link href={`/checkout?product=${product.slug}&host=cloud`} className="text-sm font-bold px-5 py-2.5 rounded-xl border transition" style={{ borderColor: theme.border, color: KIT_FOREGROUND }}>
              Advance Payment
            </Link>
          </motion.div>
          <motion.div variants={fade} custom={1.5} initial="hidden" animate="show" className="flex items-center gap-4 mt-6 text-xs" style={{ color: KIT_MUTED }}>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.metal[1] }} /> {product.features.length} Core Features</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.metal[1] }} /> {product.category}</span>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '1rem' }}>
            <EffectSlider effect={sliderEffect} images={heroFrames} fallback={product.image} alt={product.name} heightClass="h-56 sm:h-72" />
          </div>
          <div className="absolute -inset-3 rounded-2xl -z-10 blur-2xl opacity-30" style={{ background: metal }} />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="absolute -bottom-4 -left-4 rounded-xl shadow-xl p-3 flex items-center gap-2.5 border" style={{ background: theme.surface, borderColor: theme.border }}>
            <div className="kit-shine w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: metal, color: theme.metalInk }}>
              <Icon name={product.benefits[0]?.icon || 'Sparkles'} className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold leading-tight" style={{ color: KIT_FOREGROUND }}>{product.benefits[0]?.title}</div>
              <div className="text-[9px]" style={{ color: KIT_MUTED }}>Core Benefit</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="border-y py-3 overflow-hidden" style={{ background: theme.surface, borderColor: theme.border }}>
        <div className="flex w-max animate-marquee gap-8">
          {[...product.features, ...product.features].map((f, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap" style={{ color: KIT_MUTED }}>
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.metal[1] }} /> {f}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="px-5 sm:px-10 py-14 max-w-6xl mx-auto">
        <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: KIT_FOREGROUND }}>Everything Included</h2>
          <p className="text-sm" style={{ color: KIT_MUTED }}>Every feature {product.name} ships with — no add-ons required.</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {product.features.map((f, i) => (
            <motion.div key={f} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -3 }} className="kit-line relative overflow-hidden border rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-3" style={{ background: theme.surface, borderColor: theme.border }}>
              <div className="kit-shine w-9 h-9 rounded-lg grid place-items-center shrink-0" style={{ background: metal, color: theme.metalInk }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold" style={{ color: KIT_FOREGROUND }}>{f}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-5 sm:px-10 py-14 max-w-6xl mx-auto">
        <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: KIT_FOREGROUND }}>Gallery</h2>
          <p className="text-sm" style={{ color: KIT_MUTED }}>A closer look at {product.name}.</p>
        </motion.div>
        <EffectGallery effect={galleryEffect} images={galleryImages} fallback={product.image} alt={product.name} accent={theme.metal[1]} />
      </section>

      {/* Dashboard preview — the real interactive demo, framed as a live preview */}
      <section id="dashboard" className="px-5 sm:px-10 py-14" style={{ background: '#000000' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-3 py-1 mb-3" style={{ color: theme.metal[0], background: `${theme.metal[1]}22`, border: `1px solid ${theme.border}` }}>
              <Lock className="w-3 h-3" /> Preview build — full version unlocks on purchase
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: KIT_FOREGROUND }}>See It In Action</h2>
            <p className="text-sm" style={{ color: KIT_MUTED }}>A live look at the {product.name} dashboard.</p>
          </motion.div>

          <motion.div variants={fade} custom={0.3} initial="hidden" whileInView="show" viewport={{ once: true }} className="kit-breathe rounded-2xl shadow-2xl overflow-hidden border" style={{ background: theme.surface, borderColor: theme.border }}>
            <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: theme.surfaceTint }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 rounded-full px-3 py-1 text-[11px] truncate" style={{ background: theme.bg, color: KIT_MUTED }}>app.{product.slug}.kvlbusiness.com/dashboard</div>
            </div>
            <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto">
              <DemoContent slug={product.slug} navIndex={0} color={theme.metal[1]} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-us" className="px-5 sm:px-10 py-14 max-w-6xl mx-auto">
        <motion.h2 variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-xl sm:text-2xl font-extrabold text-center mb-8" style={{ color: KIT_FOREGROUND }}>
          Why Businesses Choose {product.name}
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {product.benefits.map((b, i) => (
            <motion.div key={b.title} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -3 }} className="kit-line relative overflow-hidden rounded-2xl p-5 border hover:shadow-lg transition-shadow" style={{ background: theme.surface, borderColor: theme.border }}>
              <div className="kit-shine w-10 h-10 rounded-xl grid place-items-center mb-3" style={{ background: metal, color: theme.metalInk }}>
                <Icon name={b.icon} className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold mb-1.5" style={{ color: KIT_FOREGROUND }}>{b.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: KIT_MUTED }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-5 sm:px-10 py-14" style={{ background: metal }}>
        <div className="max-w-3xl mx-auto text-center" style={{ color: theme.metalInk }}>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Ready to run your business on {product.name}?</h2>
          <p className="text-sm mb-6 opacity-80">Explore the full feature set, no commitment to look around.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/checkout?product=${product.slug}&host=cloud`} className="kit-shine text-sm font-bold px-6 py-3 rounded-xl transition" style={{ background: gold, color: '#2a1d05' }}>
              Advance Payment
            </Link>
            <a href={`https://wa.me/${wa}?text=I want to know more about ${product.name}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl bg-black/15 border border-black/20 hover:bg-black/25 transition">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="px-5 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t" style={{ background: '#000000', borderColor: theme.border }}>
        <span className="text-[11px]" style={{ color: KIT_MUTED }}>&copy; KVL Business Solutions &middot; {product.name} preview</span>
        <Link href={`/software/${product.slug}`} className="text-[11px] hover:opacity-80 transition" style={{ color: KIT_MUTED }}>Exit Preview</Link>
      </div>
    </div>
  );
}
