'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Ticket, FileText, Package, Box, UserCog, Mail,
  Activity, Tag, Calendar, Star, Settings, Megaphone, Globe, Monitor, Cpu,
  Workflow, Briefcase, Sparkles, Bell, Search, LogOut, ChevronRight,
  TrendingUp, Zap, Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    label: 'OVERVIEW',
    links: [
      { href: '/admin',          label: 'Dashboard',   Icon: LayoutDashboard },
      { href: '/admin/activity', label: 'Activity',    Icon: Activity },
      { href: '/admin/api-usage',label: 'API Usage',   Icon: Cpu },
    ],
  },
  {
    label: 'SALES & CRM',
    links: [
      { href: '/admin/leads',    label: 'Leads',       Icon: Users },
      { href: '/admin/bookings', label: 'Bookings',    Icon: Calendar },
      { href: '/admin/orders',   label: 'Orders',      Icon: Package },
      { href: '/admin/quotes',   label: 'Quotes',      Icon: FileText },
    ],
  },
  {
    label: 'CONTENT',
    links: [
      { href: '/admin/demos',    label: 'Demos',       Icon: Monitor },
      { href: '/admin/products', label: 'Products',    Icon: Box },
      { href: '/admin/courses',  label: 'Courses',     Icon: Briefcase },
      { href: '/admin/jobs',     label: 'Jobs',        Icon: Briefcase },
      { href: '/admin/banners',  label: 'Banners',     Icon: Megaphone },
      { href: '/admin/reviews',  label: 'Reviews',     Icon: Star },
    ],
  },
  {
    label: 'SYSTEM',
    links: [
      { href: '/admin/users',         label: 'Users',         Icon: UserCog },
      { href: '/admin/subscribers',   label: 'Subscribers',   Icon: Mail },
      { href: '/admin/tickets',       label: 'Tickets',       Icon: Ticket },
      { href: '/admin/coupons',       label: 'Coupons',       Icon: Tag },
      { href: '/admin/workflows',     label: 'Workflows',     Icon: Workflow },
      { href: '/admin/site-settings', label: 'Site Settings', Icon: Settings },
      { href: '/admin/ai-content',    label: 'AI Content',    Icon: Sparkles },
    ],
  },
];

/* Live system health indicators */
const systemStatus = [
  { label: 'API',     status: 'online',  color: '#22c55e' },
  { label: 'DB',      status: 'online',  color: '#22c55e' },
  { label: 'GPS',     status: 'online',  color: '#22c55e' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const crumbs = pathname.split('/').filter(Boolean);
  const pageLabel = crumbs.length > 1
    ? crumbs[crumbs.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Dashboard';

  return (
    <div className="flex min-h-screen" style={{ background: '#08080a' }}>

      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        className="w-[260px] flex-shrink-0 flex flex-col sticky top-0 h-screen"
        style={{
          background: 'linear-gradient(180deg, #0a0a0c 0%, #080809 100%)',
          borderRight: '1px solid rgba(255,255,255,0.055)',
        }}
      >
        {/* Top glow line */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,168,112,0.35) 50%, transparent 100%)',
        }} />

        {/* Logo & nav link */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/" className="flex items-center gap-3 group mb-4">
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(200,168,112,0.08)',
              border: '1px solid rgba(200,168,112,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="font-black text-[13px]" style={{ color: '#c8a870', letterSpacing: '1px' }}>K</span>
            </div>
            <div>
              <div className="font-bold text-[14px] tracking-wide text-white leading-none">KVL Admin</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Business Solutions</div>
            </div>
          </Link>

          {/* System health */}
          <div className="flex items-center gap-3">
            {systemStatus.map(s => (
              <div key={s.label} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {sections.map(s => (
            <div key={s.label}>
              <p className="admin-section-label">{s.label}</p>
              <div className="space-y-0.5">
                {s.links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={l.href}
                        className={`admin-sidebar-link ${active ? 'active' : ''}`}
                      >
                        <l.Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="flex-1">{l.label}</span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: '#c8a870', boxShadow: '0 0 8px rgba(200,168,112,0.5)' }} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* View website link */}
        <div className="px-3 pb-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-150 group"
            style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            View website
            <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
          </Link>
        </div>

        {/* User info at bottom */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{
                background: 'rgba(200,169,110,0.12)',
                color: '#c8a96e',
                border: '1.5px solid rgba(200,169,110,0.25)',
                boxShadow: '0 0 12px rgba(200,168,112,0.1)',
              }}
            >
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white leading-tight">Admin</p>
              <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.25)' }}>KVL Business Solutions</p>
            </div>
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0"
              style={{ color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}
              title="Logout"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#f87171';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-7"
          style={{
            height: 60,
            background: 'rgba(8,8,10,0.9)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.055)',
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px]">
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>Admin</span>
            <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.15)' }} />
            <span className="font-semibold capitalize" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {pageLabel}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium"
              style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)', color: '#22c55e' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              System Online
            </div>

            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] cursor-pointer transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search anything...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                ⌘K
              </kbd>
            </div>

            {/* Notifications */}
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 relative"
              style={{
                color: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#f0ede6';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#c8a96e', boxShadow: '0 0 6px rgba(200,168,112,0.6)' }} />
            </button>

            {/* Admin avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
              style={{
                background: 'rgba(200,169,110,0.1)',
                color: '#c8a96e',
                border: '1.5px solid rgba(200,169,110,0.25)',
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1" style={{ background: '#08080a', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
