'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart, Zap, X, Menu, LogOut, Bell, Search, Box, Circle,
  BadgeIndianRupee, Boxes, Brain, Building2, Code2, Fingerprint, Globe, GraduationCap, Handshake,
  HardHat, Hotel, Network, Receipt, Satellite, Stethoscope, TrendingUp, UtensilsCrossed, Wrench,
  AlertTriangle, ArrowDownCircle, ArrowUpCircle, BarChart2, Bed, BedDouble, BookOpen, Briefcase,
  CalendarCheck, CalendarDays, CalendarOff, ChefHat, ClipboardList, Clock, Cog, CreditCard,
  DollarSign, FileText, FlaskConical, GitBranch, Grid3X3, Home, LayoutDashboard, Map, MapPin,
  MessageSquare, Package, Pill, Route, ShoppingBag, Sparkles, Truck, Users,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import type { Software } from '@/lib/data/software';

// Every distinct top-level `icon` value used in lib/data/software.ts.
const PRODUCT_ICON_MAP: Record<string, LucideIcon> = {
  BadgeIndianRupee, Boxes, Brain, Building2, Code2, Fingerprint, Globe, GraduationCap, Handshake,
  HardHat, Hotel, Network, Receipt, Satellite, Stethoscope, TrendingUp, UtensilsCrossed, Wrench,
};

// Every distinct `demoNav[].icon` value used in lib/data/software.ts.
const NAV_ICON_MAP: Record<string, LucideIcon> = {
  AlertTriangle, ArrowDownCircle, ArrowUpCircle, BadgeIndianRupee, BarChart2, Bed, BedDouble, Bell,
  BookOpen, Briefcase, CalendarCheck, CalendarDays, CalendarOff, ChefHat, ClipboardList, Clock,
  Cog, CreditCard, DollarSign, FileText, FlaskConical, GitBranch, Globe, Grid3X3, Home,
  LayoutDashboard, Map, MapPin, MessageSquare, Package, Pill, Receipt, Route, ShoppingBag,
  ShoppingCart, Sparkles, TrendingUp, Truck, Users, Zap,
};

export function DemoShell({ product, children, activeNav, onNavChange }: { product: Software; children: React.ReactNode; activeNav: number; onNavChange: (i: number) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Icon = PRODUCT_ICON_MAP[product.icon] || Box;
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Demo Banner */}
      <div className="z-50 text-center py-2 px-4 text-[11px] font-semibold flex items-center justify-center gap-3 flex-wrap" style={{ background: `linear-gradient(90deg,${product.c1},${product.c2})` }}>
        <span>🎯 DEMO MODE — Explore {product.name} freely. No sign-up required.</span>
        <div className="flex items-center gap-2">
          <Link href={`/checkout?product=${product.slug}&host=cloud`} className="bg-white text-slate-900 px-3 py-0.5 rounded-full text-[10px] font-bold hover:opacity-90 transition">
            Buy {formatINR(product.price)}{product.unit}
          </Link>
          {!product.buyOnly && (
            <Link href={`/checkout?product=${product.slug}&plan=monthly`} className="bg-white/20 border border-white/40 text-white px-3 py-0.5 rounded-full text-[10px] font-bold hover:bg-white/30 transition">
              Rent {formatINR(product.monthlyRent)}{product.rentUnit}
            </Link>
          )}
          <Link href={`/software/${product.slug}`} className="opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></Link>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 inset-y-0 left-0 w-56 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300`}>
          {/* Logo */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: `linear-gradient(135deg,${product.c1},${product.c2})` }}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{product.name}</div>
              <div className="text-[10px] text-slate-400">Demo Account</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {product.demoNav.map((item, i) => {
              const NavIcon = NAV_ICON_MAP[item.icon] || Circle;
              return (
                <button
                  key={item.label}
                  onClick={() => { onNavChange(i); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeNav === i ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  style={activeNav === i ? { background: `linear-gradient(135deg,${product.c1}33,${product.c2}33)`, color: product.c1 } : {}}
                >
                  <NavIcon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t border-slate-800 space-y-2">
            <a href={`https://wa.me/${wa}?text=I want to buy ${product.name}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition">
              💬 Buy via WhatsApp
            </a>
            <Link href={`/software/${product.slug}`} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-xs transition">
              <LogOut className="w-3.5 h-3.5" /> Exit Demo
            </Link>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-500" placeholder="Search..." />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button className="relative text-slate-400 hover:text-white">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 grid place-items-center text-[10px] font-bold">D</div>
              <span className="text-xs text-slate-300 hidden sm:block">Demo User</span>
            </div>
          </header>

          {/* Section Title */}
          <div className="bg-slate-900/50 px-6 py-3 border-b border-slate-800/60 flex items-center gap-2">
            {(() => {
              const item = product.demoNav[activeNav];
              const NavIcon = NAV_ICON_MAP[item.icon] || Circle;
              return (
                <>
                  <NavIcon className="w-4 h-4" style={{ color: product.c1 }} />
                  <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                </>
              );
            })()}
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            {children}
          </main>
        </div>
      </div>

      {/* Floating buy bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 text-sm hidden lg:flex">
        <span className="text-slate-300">Ready to own <b className="text-white">{product.name}</b>?</span>
        <Link href={`/checkout?product=${product.slug}&host=cloud`} className="btn btn-primary text-xs gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5" /> Buy {formatINR(product.price)}{product.unit}
        </Link>
        {!product.buyOnly && (
          <Link href={`/checkout?product=${product.slug}&plan=monthly`} className="btn text-xs gap-1.5 text-white border border-violet-600 hover:bg-violet-600/20">
            <Zap className="w-3.5 h-3.5 text-violet-400" /> Rent {formatINR(product.monthlyRent)}{product.rentUnit}
          </Link>
        )}
      </div>
    </div>
  );
}
