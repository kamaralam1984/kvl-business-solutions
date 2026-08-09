'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MousePointerClick, Send, FileText } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type NameCount = { name: string; count: number };
type PathCount = { path: string; count: number };
type Daily = { date: string; count: number };

const CARD = { background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' };

export default function ConversionEventsPage() {
  const [byName, setByName] = useState<NameCount[]>([]);
  const [topLandingPages, setTopLandingPages] = useState<PathCount[]>([]);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    fetch('/api/admin/conversion-events')
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setByName(d.byName); setTopLandingPages(d.topLandingPages); setDaily(d.daily); }
        else setLoadError(true);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const conversions = ['lead_submit', 'proposal_request', 'booking_submit', 'register_submit', 'support_ticket_submit', 'newsletter_signup'];
  const conversionCount = byName.filter(n => conversions.includes(n.name)).reduce((s, n) => s + n.count, 0);
  const ctaCount = byName.find(n => n.name === 'cta_click')?.count || 0;

  const chartData = daily.map(d => ({
    label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    count: d.count,
  }));

  const kpis = [
    { label: 'Conversions (30d)', val: conversionCount.toLocaleString('en-IN'), Icon: Send, color: '#4ade80' },
    { label: 'CTA Clicks (30d)', val: ctaCount.toLocaleString('en-IN'), Icon: MousePointerClick, color: '#c8a96e' },
    { label: 'Event Types Tracked', val: byName.length.toLocaleString('en-IN'), Icon: FileText, color: '#60a5fa' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
          Conversion Events
        </h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
          Real first-party events from this site (CTA clicks, form submissions, leads) — no GA4/ad-platform API needed.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-5" style={CARD}><AdminSkeleton rows={2} /></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 stagger-children">
            {kpis.map(k => (
              <div key={k.label} className="admin-card-hover kpi-enter rounded-2xl p-5" style={CARD}>
                <div className="flex items-center gap-2 mb-2">
                  <k.Icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(var(--text) / 0.4)' }}>{k.label}</span>
                </div>
                <div className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{k.val}</div>
              </div>
            ))}
          </div>

          <div className="kpi-enter rounded-2xl p-5" style={CARD}>
            <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Events — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border) / 0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                <Bar dataKey="count" name="Events" fill="#c8a96e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Event Breakdown</h2>
              <div className="space-y-2">
                {loadError && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</p>}
                {!loadError && byName.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No events yet.</p>}
                {byName.map(n => (
                  <div key={n.name} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }}>{n.name}</span>
                    <span className="font-semibold" style={{ color: 'rgb(var(--text))' }}>{n.count.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Converting Pages</h2>
              <div className="space-y-2">
                {loadError && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</p>}
                {!loadError && topLandingPages.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No data yet.</p>}
                {topLandingPages.map(p => (
                  <div key={p.path} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{p.path}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{p.count.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
