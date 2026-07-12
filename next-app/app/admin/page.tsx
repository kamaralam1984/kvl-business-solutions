import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Ticket } from '@/lib/models/Ticket';
import { Quote } from '@/lib/models/Quote';
import { Order } from '@/lib/models/Order';
import { CronLog } from '@/lib/models/CronLog';
import { getIntegrationsSummary } from '@/lib/integrations-status';
import { formatINR } from '@/lib/utils';
import {
  Users, Ticket as TicketIcon, FileText, Package,
  TrendingUp, ArrowUpRight, Zap, HeartPulse, Plug,
  BookOpen, Globe,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const CRON_JOBS = [
  'lead-followup', 'lead-nurture', 'review-request', 'abandoned-orders',
  'renewal-reminders', 'workflow-triggers', 'expire-coupons',
];

function pctChange(recent: number, prev: number): { text: string; up: boolean } {
  if (prev === 0) return recent > 0 ? { text: 'New', up: true } : { text: '—', up: true };
  // A tiny baseline (e.g. 1 → 43) produces a mathematically "correct" but
  // absurd swing like +4200% — not meaningful at that sample size, so fall
  // back to a qualitative label instead of a wild percentage.
  if (prev < 5) {
    if (recent > prev) return { text: '↑ Growing', up: true };
    if (recent < prev) return { text: '↓ Slowing', up: false };
    return { text: '→ Flat', up: true };
  }
  const change = Math.round(((recent - prev) / prev) * 100);
  return { text: `${change >= 0 ? '+' : ''}${change}%`, up: change >= 0 };
}

export default async function AdminHome() {
  await connectDB();

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60_000);
  const d60 = new Date(now.getTime() - 60 * 24 * 60 * 60_000);

  const [
    leads, tickets, quotes, orders, revenue,
    leadsRecent, leadsPrev, quotesRecent, quotesPrev, ordersRecent, ordersPrev,
    dailyRevenue, cronLatest,
  ] = await Promise.all([
    Lead.countDocuments({}),
    Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
    Quote.countDocuments({}),
    Order.countDocuments({ status: 'paid' }),
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Lead.countDocuments({ createdAt: { $gte: d30 } }),
    Lead.countDocuments({ createdAt: { $gte: d60, $lt: d30 } }),
    Quote.countDocuments({ createdAt: { $gte: d30 } }),
    Quote.countDocuments({ createdAt: { $gte: d60, $lt: d30 } }),
    Order.countDocuments({ status: 'paid', createdAt: { $gte: d30 } }),
    Order.countDocuments({ status: 'paid', createdAt: { $gte: d60, $lt: d30 } }),
    // Last 8 days of paid-order revenue, for the sparkline
    Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: new Date(now.getTime() - 8 * 24 * 60 * 60_000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' } } },
    ]),
    // Most recent run per automation job, to derive a real health count
    CronLog.aggregate([
      { $sort: { ranAt: -1 } },
      { $group: { _id: '$job', status: { $first: '$status' } } },
    ]),
  ]);
  const totalRevenue = revenue[0]?.total || 0;

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const leadsTrend = pctChange(leadsRecent, leadsPrev);
  const quotesTrend = pctChange(quotesRecent, quotesPrev);
  const ordersTrend = pctChange(ordersRecent, ordersPrev);

  // Build an 8-slot sparkline from real daily revenue, filling any day with
  // no paid orders as 0 rather than skipping it.
  const revenueByDay = new Map(dailyRevenue.map((d: any) => [d._id, d.total]));
  const sparkline: number[] = [];
  for (let i = 7; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60_000).toISOString().slice(0, 10);
    sparkline.push(revenueByDay.get(day) || 0);
  }
  const maxDay = Math.max(...sparkline, 1);

  const cronHealthyCount = cronLatest.filter((c: any) => c.status === 'success').length;
  const integrations = getIntegrationsSummary();

  const kpiCards = [
    { label: 'Total Leads', val: leads, Icon: Users, color: '#60a5fa', sub: 'All time enquiries', trend: leadsTrend.text, trendUp: leadsTrend.up },
    { label: 'Open Tickets', val: tickets, Icon: TicketIcon, color: '#f87171', sub: 'Needs attention', trend: tickets > 5 ? 'High' : 'Normal', trendUp: false },
    { label: 'Quote Requests', val: quotes, Icon: FileText, color: '#fbbf24', sub: 'All time requests', trend: quotesTrend.text, trendUp: quotesTrend.up },
    { label: 'Paid Orders', val: orders, Icon: Package, color: '#4ade80', sub: 'Completed orders', trend: ordersTrend.text, trendUp: ordersTrend.up },
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
          className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.2)] text-[#c8a96e] hover:bg-[rgba(200,169,110,0.14)] hover:border-[rgba(200,169,110,0.35)]"
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
              <span className="badge badge-green">Lifetime, paid orders only</span>
            </div>
          </div>

          {/* Right side mini-chart */}
          <div className="flex flex-col items-end gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#c8a96e' }} />
            </div>
            {/* Sparkline bars — real daily revenue for the last 8 days */}
            <div className="flex items-end gap-1" style={{ height: 32 }} title="Paid-order revenue, last 8 days">
              {sparkline.map((amount, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: `${Math.max(6, Math.round((amount / maxDay) * 100))}%`,
                    borderRadius: 2,
                    background: i === sparkline.length - 1 ? '#c8a96e' : 'rgba(200,169,110,0.25)',
                    alignSelf: 'flex-end',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {kpiCards.map(s => (
          <div key={s.label} className="kpi-card kpi-enter">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
          {quickActions.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="admin-quick-action kpi-enter flex flex-col items-center gap-2.5 p-3.5 rounded-xl text-center transition-all duration-200 group"
              style={{
                background: `${l.color}0a`,
                border: `1px solid ${l.color}18`,
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

      {/* System status row — real automation + integration health, not placeholder numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/admin/automation" className="admin-card-hover rounded-xl p-5 block"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <HeartPulse className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Automation Health</span>
          </div>
          <div className="font-black text-[1.6rem] leading-none mb-1" style={{ color: '#f0ede6', letterSpacing: '-0.02em' }}>
            {cronHealthyCount} / {CRON_JOBS.length}
          </div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Marketing automation jobs last ran successfully — {CRON_JOBS.length - cronLatest.length} have never run yet
          </div>
        </a>
        <a href="/admin/integrations" className="admin-card-hover rounded-xl p-5 block"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.1)' }}>
              <Plug className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Integrations Configured</span>
          </div>
          <div className="font-black text-[1.6rem] leading-none mb-1" style={{ color: '#f0ede6', letterSpacing: '-0.02em' }}>
            {integrations.configuredCount} / {integrations.total}
          </div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Email, WhatsApp, AI, payments & analytics keys
          </div>
        </a>
      </div>
    </div>
  );
}
