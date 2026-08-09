'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Radio, Users, Globe2, Flame, ArrowUpRight, MapPin, Smartphone, Monitor, Tablet,
  Mail, Phone, Clock, TrendingUp, User as UserIcon,
} from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

const CARD = { background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' };
const DEVICE_ICON: Record<string, any> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
const DONUT_COLORS = ['#c8a96e', '#4ade80', '#60a5fa', '#f97316', '#a78bfa', '#f472b6', '#22d3ee'];

function timeAgo(date: string | Date) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function hourLabel(h: number) {
  const period = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr} ${period}`;
}

function PulseDot({ color = '#4ade80' }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: color }} />
    </span>
  );
}

// Animated count-up for KPI numbers — plays once whenever `value` changes,
// eased so it settles rather than ticking linearly.
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(value)) return;
    let raf = 0;
    const start = performance.now();
    const duration = 700;
    const animateFrame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(animateFrame);
    };
    raf = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toLocaleString('en-IN')}</>;
}

export default function VipOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [landing, setLanding] = useState<any>(null);
  const [live, setLive] = useState<any>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(() => fetch('/api/admin/vip/overview').then(r => r.json()).then(d => d.ok && setOverview(d)), []);
  const loadLanding = useCallback(() => fetch(`/api/admin/vip/landing-pages?days=${days}`).then(r => r.json()).then(d => d.ok && setLanding(d)), [days]);
  const loadLive = useCallback(() => fetch('/api/admin/vip/live').then(r => r.json()).then(d => d.ok && setLive(d)), []);

  // Live panel refreshes fast (~7s) since there's no websocket/SSE push on
  // this VPS — a tight poll is the closest we get to "real time" without
  // adding infra. Overview/landing-page numbers change slowly, so they poll
  // much less often.
  useEffect(() => {
    Promise.all([loadOverview(), loadLive()]).finally(() => setLoading(false));
    const tOverview = setInterval(loadOverview, 30_000);
    const tLive = setInterval(loadLive, 7_000);
    return () => { clearInterval(tOverview); clearInterval(tLive); };
  }, [loadOverview, loadLive]);

  useEffect(() => { loadLanding(); }, [loadLanding]);

  const kpis = overview ? [
    { label: 'Live Now', val: overview.liveVisitorCount, Icon: Radio, color: '#4ade80', pulse: true },
    { label: 'New Visitors (24h)', val: overview.visitorsToday, Icon: Users, color: '#60a5fa' },
    { label: `Landing Views (${days}d)`, val: landing ? landing.totalViews : '—', Icon: TrendingUp, color: '#c8a96e' },
    { label: 'Sessions (24h)', val: overview.sessionsToday, Icon: Globe2, color: '#f97316' },
  ] : [];

  const chartData = (landing?.daily || []).map((d: any) => ({
    label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    count: d.count,
    unique: d.uniqueVisitors,
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>Landing Page Analytics</h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Kaun, kahan se, kis din, kis page par — real tracked visitor data. Live panel har ~7 second mein refresh hota hai.
          </p>
        </div>
        <div className="flex gap-1 rounded-full p-1" style={{ background: 'rgba(var(--surface) / 0.06)' }}>
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors"
              style={{ background: days === d ? '#c8a96e' : 'transparent', color: days === d ? '#0a0a0a' : 'rgba(var(--text) / 0.5)' }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-4 gap-4">{[0, 1, 2, 3].map(i => <div key={i} className="rounded-2xl p-5" style={CARD}><AdminSkeleton rows={2} /></div>)}</div>
      ) : !overview ? (
        <div className="rounded-2xl p-8 text-center" style={{ ...CARD, color: 'rgba(var(--text) / 0.4)' }}>Failed to load.</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid sm:grid-cols-4 gap-4 stagger-children">
            {kpis.map(k => (
              <div key={k.label} className="admin-card-hover kpi-enter rounded-2xl p-5" style={CARD}>
                <div className="flex items-center gap-2 mb-2">
                  {k.pulse && <PulseDot color={k.color} />}
                  <k.Icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(var(--text) / 0.4)' }}>{k.label}</span>
                </div>
                <div className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>
                  {typeof k.val === 'number' ? <CountUp value={k.val} /> : k.val}
                </div>
              </div>
            ))}
          </div>

          {/* Live Now */}
          <div className="kpi-enter rounded-2xl overflow-hidden" style={CARD}>
            <div className="p-5 pb-3 flex items-center gap-2">
              <PulseDot />
              <h2 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Live Now — {live?.count ?? 0} online</h2>
            </div>
            <div className="px-5 pb-5 space-y-2 max-h-[440px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {(live?.visitors || []).map((v: any) => {
                  const DevIcon = DEVICE_ICON[v.device?.type as string] || Monitor;
                  return (
                    <motion.div
                      key={v.sessionId}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ background: 'rgba(var(--surface) / 0.04)' }}
                    >
                      <div className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: v.isKnown ? 'rgba(200,169,110,0.15)' : 'rgba(var(--surface) / 0.08)' }}>
                        <UserIcon className="w-4 h-4" style={{ color: v.isKnown ? '#c8a96e' : 'rgba(var(--text) / 0.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[13px] truncate" style={{ color: 'rgb(var(--text))' }}>{v.name || 'Anonymous visitor'}</span>
                          {v.geo?.city && (
                            <span className="text-[10px] flex items-center gap-0.5 shrink-0" style={{ color: 'rgba(var(--text) / 0.4)' }}>
                              <MapPin className="w-3 h-3" />{v.geo.city}{v.geo.country ? `, ${v.geo.country}` : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] flex-wrap" style={{ color: 'rgba(var(--text) / 0.45)' }}>
                          {v.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{v.email}</span>}
                          {v.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{v.phone}</span>}
                          <span className="flex items-center gap-1"><DevIcon className="w-3 h-3" />{v.device?.browser || v.device?.type || 'unknown device'}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] font-mono px-2 py-0.5 rounded-md truncate max-w-[180px]" style={{ background: 'rgba(var(--surface) / 0.08)', color: 'rgb(var(--text))' }}>{v.currentPath || '/'}</div>
                        <div className="text-[10px] mt-1 flex items-center gap-1 justify-end" style={{ color: 'rgba(var(--text) / 0.35)' }}><Clock className="w-2.5 h-2.5" />{timeAgo(v.startedAt)} on site</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {(!live || live.visitors.length === 0) && (
                <p className="text-[12px] text-center py-8" style={{ color: 'rgba(var(--text) / 0.3)' }}>Koi bhi visitor abhi online nahi hai.</p>
              )}
            </div>
          </div>

          {/* Daily trend — AdSense-style gradient area chart */}
          <div className="kpi-enter rounded-2xl p-5" style={CARD}>
            <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Landing Page Views — Last {days} Days</h2>
            {chartData.length === 0 ? (
              <p className="text-[12px] py-10 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Is range mein koi data nahi hai.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c8a96e" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#c8a96e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border) / 0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} interval={Math.max(0, Math.floor(chartData.length / 10))} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="count" name="Views" stroke="#c8a96e" strokeWidth={2.5} fill="url(#viewsGrad)" animationDuration={900} dot={false} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="unique" name="Unique Visitors" stroke="#4ade80" strokeWidth={2.5} fill="url(#uniqueGrad)" animationDuration={900} animationBegin={150} dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Peak hours — same idea as AdSense's "time of day" earnings pattern */}
          <div className="kpi-enter rounded-2xl p-5" style={CARD}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: '#60a5fa' }} />
              <h2 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Peak Hours (IST) — Last {days} Days</h2>
            </div>
            {(landing?.hourly || []).every((h: any) => h.count === 0) ? (
              <p className="text-[12px] py-10 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Is range mein koi data nahi hai.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={(landing?.hourly || []).map((h: any) => ({ hour: hourLabel(h.hour), count: h.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border) / 0.06)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 10 }} interval={1} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                  <Bar dataKey="count" name="Views" fill="#60a5fa" radius={[6, 6, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Device Type + Channel Mix — donut charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>Device Type</h2>
              {(landing?.byDevice || []).length === 0 ? (
                <p className="text-[12px] py-10 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No device data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={landing.byDevice} dataKey="count" nameKey="type" innerRadius={55} outerRadius={85} paddingAngle={3} animationDuration={800} isAnimationActive>
                      {landing.byDevice.map((_: any, i: number) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>Traffic Source</h2>
              {(landing?.byChannel || []).length === 0 ? (
                <p className="text-[12px] py-10 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No sessions yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={landing.byChannel} dataKey="count" nameKey="channel" innerRadius={55} outerRadius={85} paddingAngle={3} animationDuration={800} isAnimationActive>
                      {landing.byChannel.map((_: any, i: number) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pages / Geo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Landing Pages</h2>
              <div className="space-y-2">
                {(landing?.byPage || []).length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No data yet.</p>}
                {(landing?.byPage || []).map((p: any) => (
                  <div key={p.path} className="flex justify-between text-[12px]">
                    <span className="truncate mr-2" style={{ color: 'rgba(var(--text) / 0.6)' }}>{p.path}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{p.count} · {p.uniqueVisitors} uniq</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Country / City</h2>
              <p className="text-[10px] mb-3" style={{ color: 'rgba(var(--text) / 0.3)' }}>IP-based — city/state granularity. India district-level data isn&apos;t available from free geo-IP providers.</p>
              <div className="space-y-2">
                {(landing?.byCity || []).length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No geo data yet.</p>}
                {(landing?.byCity || []).map((c: any) => (
                  <div key={`${c.city}-${c.country}`} className="flex justify-between text-[12px]">
                    <span className="truncate mr-2" style={{ color: 'rgba(var(--text) / 0.6)' }}>{c.city}{c.region ? `, ${c.region}` : ''}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent landing-page visitors */}
          <div className="kpi-enter rounded-2xl overflow-hidden" style={CARD}>
            <div className="p-5 pb-0 flex items-center gap-2">
              <Globe2 className="w-4 h-4" style={{ color: '#60a5fa' }} />
              <h2 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Recent Landing Page Visitors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-3">
                <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
                  <tr><th className="p-3">Visitor</th><th className="p-3">Contact</th><th className="p-3">Page</th><th className="p-3">Location</th><th className="p-3">Source</th><th className="p-3">When</th></tr>
                </thead>
                <tbody>
                  {(landing?.recentVisitors || []).map((v: any) => (
                    <tr key={v.vid + v.startedAt} style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                      <td className="p-3 font-semibold whitespace-nowrap" style={{ color: 'rgb(var(--text))' }}>{v.name || 'Anonymous'}</td>
                      <td className="p-3 text-[11px]" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                        {v.email && <div>{v.email}</div>}
                        {v.phone && <div>{v.phone}</div>}
                        {!v.email && !v.phone && '—'}
                      </td>
                      <td className="p-3 whitespace-nowrap" style={{ color: 'rgba(var(--text) / 0.6)' }}>{v.landingPage}</td>
                      <td className="p-3 whitespace-nowrap" style={{ color: 'rgba(var(--text) / 0.6)' }}>{v.geo?.city ? `${v.geo.city}, ${v.geo.country}` : (v.geo?.country || '—')}</td>
                      <td className="p-3 whitespace-nowrap" style={{ color: 'rgba(var(--text) / 0.6)' }}>{v.channel || 'direct'}</td>
                      <td className="p-3 text-[11px] whitespace-nowrap" style={{ color: 'rgba(var(--text) / 0.4)' }}>{new Date(v.startedAt).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  {(landing?.recentVisitors || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No landing page visits recorded in this range yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Known Visitors — Leads & Deals */}
          <div className="kpi-enter rounded-2xl overflow-hidden" style={CARD}>
            <div className="p-5 pb-0 flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
              <h2 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Known Visitors — Leads &amp; Deals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-3">
                <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
                  <tr><th className="p-3">Visitor</th><th className="p-3">Sessions</th><th className="p-3">Pages</th><th className="p-3">Score</th><th className="p-3">Last Seen</th><th></th></tr>
                </thead>
                <tbody>
                  {overview.knownVisitors.map((v: any) => (
                    <tr key={v.vid} style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                      <td className="p-3">
                        <div className="font-semibold" style={{ color: 'rgb(var(--text))' }}>{v.name || '(no name yet)'}</div>
                        <div className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.4)' }}>{v.email}</div>
                      </td>
                      <td className="p-3" style={{ color: 'rgba(var(--text) / 0.6)' }}>{v.sessionCount}</td>
                      <td className="p-3" style={{ color: 'rgba(var(--text) / 0.6)' }}>{v.pageViewCount}</td>
                      <td className="p-3">
                        {v.score != null ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                            background: v.tier === 'hot' ? 'rgba(249,115,22,0.15)' : v.tier === 'warm' ? 'rgba(234,179,8,0.15)' : 'rgba(var(--surface) / 0.08)',
                            color: v.tier === 'hot' ? '#f97316' : v.tier === 'warm' ? '#eab308' : 'rgba(var(--text) / 0.5)',
                          }}>{v.score} · {v.tier}</span>
                        ) : <span style={{ color: 'rgba(var(--text) / 0.3)' }}>—</span>}
                      </td>
                      <td className="p-3 text-[11px]" style={{ color: 'rgba(var(--text) / 0.4)' }}>{new Date(v.lastSeenAt).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right">
                        <Link href={`/admin/vip/visitors/${v.vid}`} className="text-[11px] flex items-center gap-1 justify-end" style={{ color: '#c8a96e' }}>
                          Timeline <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {overview.knownVisitors.length === 0 && <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No known visitors yet — this fills in as visitors submit forms.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
