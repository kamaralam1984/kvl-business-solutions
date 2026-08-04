'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, UserCheck, CalendarCheck, FileText, Trophy, Wallet, TrendingUp, Percent, AlertCircle } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';
import { formatINR } from '@/lib/utils';

const CARD = { background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' };

export default function RevenueDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue').then(r => r.json()).then(d => d.ok && setData(d)).finally(() => setLoading(false));
  }, []);

  const chartData = (data?.dailyVisitors || []).map((d: any) => ({
    label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    count: d.count,
  }));

  const kpis = data ? [
    { label: 'Avg Daily Visitors (30d)', val: data.kpis.dailyVisitorsAvg.toLocaleString('en-IN'), Icon: Users, color: '#60a5fa' },
    { label: 'Qualified Leads (30d)', val: data.kpis.qualifiedLeads30d.toLocaleString('en-IN'), Icon: UserCheck, color: '#4ade80' },
    { label: 'Meetings Booked (30d)', val: data.kpis.meetingsBooked30d.toLocaleString('en-IN'), Icon: CalendarCheck, color: '#c8a96e' },
    { label: 'Proposals In Flight', val: data.kpis.proposalsInFlight.toLocaleString('en-IN'), Icon: FileText, color: '#f97316' },
    { label: 'Won Deals (all-time)', val: data.kpis.wonDeals.toLocaleString('en-IN'), Icon: Trophy, color: '#22c55e' },
    { label: 'Won Value (all-time)', val: formatINR(data.kpis.wonValue), Icon: Wallet, color: '#22c55e' },
    { label: 'Pipeline Value', val: formatINR(data.kpis.pipelineValue), Icon: TrendingUp, color: '#a78bfa' },
    { label: 'Avg Deal Size', val: formatINR(data.kpis.avgDealSize), Icon: Wallet, color: '#c8a96e' },
    { label: 'Lead → Customer Rate', val: `${data.kpis.conversionRatePct}%`, Icon: Percent, color: '#60a5fa' },
  ] : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>Revenue Dashboard</h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
          Every number below is computed from this site&apos;s real database — no ad-platform API, no estimates.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="rounded-2xl p-5" style={CARD}><AdminSkeleton rows={2} /></div>)}
        </div>
      ) : !data ? (
        <div className="rounded-2xl p-8 text-center" style={{ ...CARD, color: 'rgba(var(--text) / 0.4)' }}>Failed to load.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 stagger-children">
            {kpis.map(k => (
              <div key={k.label} className="admin-card-hover kpi-enter rounded-2xl p-5" style={CARD}>
                <div className="flex items-center gap-2 mb-2">
                  <k.Icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(var(--text) / 0.4)' }}>{k.label}</span>
                </div>
                <div className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{k.val}</div>
              </div>
            ))}
          </div>

          <div className="kpi-enter rounded-2xl p-5" style={CARD}>
            <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Daily Visitors — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border) / 0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                <Bar dataKey="count" name="Visitors" fill="#c8a96e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Best Lead Sources (30d)</h2>
              <div className="space-y-2">
                {data.topSources.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No leads yet.</p>}
                {data.topSources.map((s: any) => (
                  <div key={s.source} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{s.source}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Requested Services (30d)</h2>
              <p className="text-[10px] mb-3" style={{ color: 'rgba(var(--text) / 0.3)' }}>Proxy for industry interest — Lead has no dedicated industry field.</p>
              <div className="space-y-2">
                {data.topServices.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No leads yet.</p>}
                {data.topServices.map((s: any) => (
                  <div key={s.service} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{s.service}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Landing Pages for Leads (30d)</h2>
              <div className="space-y-2">
                {data.topLandingPagesForLeads.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No lead events tracked yet.</p>}
                {data.topLandingPagesForLeads.map((p: any) => (
                  <div key={p.path} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{p.path}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="kpi-enter rounded-2xl p-5 flex items-start gap-3" style={{ ...CARD, borderColor: 'rgba(234,179,8,0.25)' }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#eab308' }} />
            <div>
              <h3 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Campaign ROI — not available yet</h3>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(var(--text) / 0.45)' }}>{data.campaignRoi.reason}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
