'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Radio, Users, Globe2, Flame, ArrowUpRight } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

const CARD = { background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' };

export default function VipOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetch('/api/admin/vip/overview').then(r => r.json()).then(d => d.ok && setData(d)).finally(() => setLoading(false));
  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // polling "live" view — see route.ts comment
    return () => clearInterval(t);
  }, []);

  const kpis = data ? [
    { label: 'Live Now (5 min)', val: data.liveVisitorCount, Icon: Radio, color: '#4ade80' },
    { label: 'New Visitors (24h)', val: data.visitorsToday, Icon: Users, color: '#60a5fa' },
    { label: 'New Visitors (7d)', val: data.visitorsLast7d, Icon: Users, color: '#60a5fa' },
    { label: 'Sessions (24h)', val: data.sessionsToday, Icon: Globe2, color: '#c8a96e' },
  ] : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>Visitor Intelligence</h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
          Real tracked visitor/session/behaviour data — Phase A. Auto-refreshes every 30s.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-4 gap-4">{[0, 1, 2, 3].map(i => <div key={i} className="rounded-2xl p-5" style={CARD}><AdminSkeleton rows={2} /></div>)}</div>
      ) : !data ? (
        <div className="rounded-2xl p-8 text-center" style={{ ...CARD, color: 'rgba(var(--text) / 0.4)' }}>Failed to load.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-4 gap-4 stagger-children">
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

          <div className="grid md:grid-cols-3 gap-4">
            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Pages (7d)</h2>
              <div className="space-y-2">
                {data.topPages.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No data yet.</p>}
                {data.topPages.map((p: any) => (
                  <div key={p.path} className="text-[12px]">
                    <div className="flex justify-between"><span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{p.path}</span><span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{p.uniqueVisitors} visitors</span></div>
                    <div style={{ color: 'rgba(var(--text) / 0.3)' }}>{p.avgTimeSeconds || 0}s avg · {p.avgScrollPct || 0}% scroll</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Channels (7d)</h2>
              <div className="space-y-2">
                {data.topChannels.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No sessions yet.</p>}
                {data.topChannels.map((c: any) => (
                  <div key={c.channel} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }} className="truncate mr-2">{c.channel}</span>
                    <span className="font-semibold shrink-0" style={{ color: 'rgb(var(--text))' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kpi-enter rounded-2xl p-5" style={CARD}>
              <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Top Countries (7d)</h2>
              <p className="text-[10px] mb-3" style={{ color: 'rgba(var(--text) / 0.3)' }}>From Vercel edge geo headers — real, not estimated.</p>
              <div className="space-y-2">
                {data.topCountries.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No geo data yet (only present when served via Vercel's edge network).</p>}
                {data.topCountries.map((c: any) => (
                  <div key={c.country} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: 'rgba(var(--text) / 0.6)' }}>{c.country}</span>
                    <span className="font-semibold" style={{ color: 'rgb(var(--text))' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="kpi-enter rounded-2xl overflow-hidden" style={CARD}>
            <div className="p-5 pb-0 flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
              <h2 className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>Known Visitors — Leads &amp; Deals</h2>
            </div>
            <table className="w-full text-sm mt-3">
              <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
                <tr><th className="p-3">Visitor</th><th className="p-3">Sessions</th><th className="p-3">Pages</th><th className="p-3">Score</th><th className="p-3">Last Seen</th><th></th></tr>
              </thead>
              <tbody>
                {data.knownVisitors.map((v: any) => (
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
                {data.knownVisitors.length === 0 && <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No known visitors yet — this fills in as visitors submit forms.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
