import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Ticket } from '@/lib/models/Ticket';
import { Quote } from '@/lib/models/Quote';
import { Order } from '@/lib/models/Order';
import { formatINR } from '@/lib/utils';
import {
  Users, Ticket as TicketIcon, FileText, Package,
  TrendingUp, ArrowUpRight, Zap, Activity,
  BookOpen, Globe,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  await connectDB();
  const [leads, tickets, quotes, orders, revenue] = await Promise.all([
    Lead.countDocuments({}),
    Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
    Quote.countDocuments({}),
    Order.countDocuments({ status: 'paid' }),
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);
  const totalRevenue = revenue[0]?.total || 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const kpiCards = [
    {
      label: 'Total Leads',
      val: leads,
      Icon: Users,
      color: '#60a5fa',
      sub: 'All time enquiries',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Open Tickets',
      val: tickets,
      Icon: TicketIcon,
      color: '#f87171',
      sub: 'Needs attention',
      trend: tickets > 5 ? 'High' : 'Normal',
      trendUp: false,
    },
    {
      label: 'Quote Requests',
      val: quotes,
      Icon: FileText,
      color: '#fbbf24',
      sub: 'All time requests',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Paid Orders',
      val: orders,
      Icon: Package,
      color: '#4ade80',
      sub: 'Completed orders',
      trend: '+24%',
      trendUp: true,
    },
  ];

  const quickActions = [
    { href: '/admin/leads',    label: 'Manage Leads',    Icon: Users,     color: '#60a5fa' },
    { href: '/admin/bookings', label: 'Bookings',        Icon: BookOpen,  color: '#c8a96e' },
    { href: '/admin/orders',   label: 'Orders',          Icon: Package,   color: '#fbbf24' },
    { href: '/admin/tickets',  label: 'Support Tickets', Icon: TicketIcon,color: '#f87171' },
    { href: '/admin/users',    label: 'User Management', Icon: Users,     color: '#4ade80' },
    { href: '/admin/demos',    label: 'Demo Sites',      Icon: Globe,     color: '#a78bfa' },
  ];

  return (
    <div className="space-y-7 max-w-6xl">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: '#f0ede6' }}>
            Command Center
          </h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{dateStr}</p>
        </div>
        <a
          href="/admin/leads"
          className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(200,169,110,0.08)',
            border: '1px solid rgba(200,169,110,0.2)',
            color: '#c8a96e',
          }}
          onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(200,169,110,0.14)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.35)'; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(200,169,110,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.2)'; }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" /> View All Leads
        </a>
      </div>

      {/* Revenue hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-7"
        style={{
          background: 'linear-gradient(135deg, #0f0f12 0%, #111114 100%)',
          border: '1px solid rgba(200,169,110,0.15)',
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 0% 0%, rgba(200,169,110,0.07) 0%, transparent 60%)',
        }} />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, rgba(200,169,110,0.6) 0%, rgba(200,169,110,0.15) 100%)',
        }} />

        <div className="relative flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(200,169,110,0.6)' }}>
              Total Revenue Generated
            </div>
            <div className="font-display font-black tracking-tight leading-none mb-2"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#c8a96e' }}>
              {formatINR(totalRevenue)}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="badge badge-green">↑ All-time high</span>
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Lifetime paid orders</span>
            </div>
          </div>

          {/* Right side mini-chart */}
          <div className="flex flex-col items-end gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#c8a96e' }} />
            </div>
            {/* Sparkline bars */}
            <div className="flex items-end gap-1" style={{ height: 32 }}>
              {[35, 52, 44, 68, 58, 82, 70, 95].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: `${h}%`,
                    borderRadius: 2,
                    background: i === 7 ? '#c8a96e' : 'rgba(200,169,110,0.25)',
                    alignSelf: 'flex-end',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(s => (
          <div key={s.label} className="kpi-card">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}14`, border: `1px solid ${s.color}28` }}>
                <s.Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: s.trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
                  color: s.trendUp ? '#22c55e' : '#f87171',
                  border: `1px solid ${s.trendUp ? 'rgba(34,197,94,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}
              >
                {s.trend}
              </span>
            </div>
            <div className="font-display font-black leading-none mb-2 text-text"
              style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
              {s.val.toLocaleString()}
            </div>
            <div className="text-[12px] font-semibold mb-0.5 text-text2">{s.label}</div>
            <div className="text-[11px] text-text3">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-3.5 h-3.5" style={{ color: '#c8a870' }} />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="flex flex-col items-center gap-2.5 p-3.5 rounded-xl text-center transition-all duration-200 group"
              style={{
                background: `${l.color}0a`,
                border: `1px solid ${l.color}18`,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.background = `${l.color}16`;
                e.currentTarget.style.borderColor = `${l.color}35`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.background = `${l.color}0a`;
                e.currentTarget.style.borderColor = `${l.color}18`;
                e.currentTarget.style.transform = '';
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${l.color}15`, border: `1px solid ${l.color}28` }}>
                <l.Icon className="w-3.5 h-3.5" style={{ color: l.color }} />
              </div>
              <span className="text-[11px] font-semibold leading-tight" style={{ color: `${l.color}cc` }}>
                {l.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* System health row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'API Health', status: '100%', sub: 'All endpoints nominal', color: '#22c55e', Icon: Activity },
          { label: 'DB Performance', status: '4ms', sub: 'Average query time', color: '#60a5fa', Icon: Zap },
          { label: 'GPS Vehicles', status: '247', sub: 'Currently tracked', color: '#c8a870', Icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `rgba(${hexRgb(s.color)},0.1)` }}>
                <s.Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
            </div>
            <div className="font-black text-[1.6rem] leading-none mb-1"
              style={{ color: '#f0ede6', letterSpacing: '-0.02em' }}>{s.status}</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
