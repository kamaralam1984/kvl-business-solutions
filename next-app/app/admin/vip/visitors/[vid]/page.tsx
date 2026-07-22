'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Globe2, Monitor, Clock } from 'lucide-react';

const CARD = { background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' };

export default function VisitorTimelinePage() {
  const { vid } = useParams<{ vid: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/vip/visitors/${vid}`).then(r => r.json()).then(d => d.ok && setData(d));
  }, [vid]);

  if (!data) return null;
  const { visitor, score, sessions, notableEvents } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.push('/admin/vip')} className="text-[12px] flex items-center gap-1" style={{ color: 'rgba(var(--text) / 0.5)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Visitor Intelligence
      </button>

      <div className="rounded-2xl p-5" style={CARD}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{visitor.knownName || 'Unidentified visitor'}</h1>
            <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.4)' }}>{visitor.knownEmail || `vid: ${visitor.vid.slice(0, 16)}…`}</p>
            <p className="text-[11px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
              First seen {new Date(visitor.firstSeenAt).toLocaleDateString('en-IN')} · {visitor.sessionCount} sessions · {visitor.pageViewCount} page views
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{
            background: score.tier === 'hot' ? 'rgba(249,115,22,0.15)' : score.tier === 'warm' ? 'rgba(234,179,8,0.15)' : 'rgba(var(--surface) / 0.08)',
            color: score.tier === 'hot' ? '#f97316' : score.tier === 'warm' ? '#eab308' : 'rgba(var(--text) / 0.5)',
          }}>{score.score}/100 · {score.tier.toUpperCase()}</span>
        </div>

        {(visitor.knownLeadId || visitor.knownDealId) && (
          <div className="mt-4 pt-4 flex gap-4 text-[12px]" style={{ borderTop: '1px solid rgba(var(--border) / 0.06)' }}>
            {visitor.knownLeadId && <span style={{ color: 'rgba(var(--text) / 0.6)' }}>Lead: <b style={{ color: 'rgb(var(--text))' }}>{visitor.knownLeadId.name}</b> ({visitor.knownLeadId.status}, {visitor.knownLeadId.leadTier} tier)</span>}
            {visitor.knownDealId && <span style={{ color: 'rgba(var(--text) / 0.6)' }}>Deal: <b style={{ color: 'rgb(var(--text))' }}>{visitor.knownDealId.title}</b> ({visitor.knownDealId.stage})</span>}
          </div>
        )}
      </div>

      <div className="rounded-2xl p-5" style={CARD}>
        <h2 className="text-[13px] font-bold mb-3" style={{ color: 'rgb(var(--text))' }}>Score Breakdown — Real Tracked Signals Only</h2>
        <div className="space-y-1.5">
          {score.breakdown.map((b: any) => (
            <div key={b.signal} className="flex items-center justify-between text-[12px]">
              <span style={{ color: 'rgba(var(--text) / 0.5)' }}>{b.signal} <span style={{ color: 'rgba(var(--text) / 0.3)' }}>(value: {b.value})</span></span>
              <span className="font-semibold" style={{ color: 'rgb(var(--text))' }}>+{b.points}</span>
            </div>
          ))}
          {score.breakdown.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>Not enough tracked activity yet.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-[13px] font-bold mb-3" style={{ color: 'rgb(var(--text))' }}>Session Timeline</h2>
        <div className="space-y-3">
          {sessions.map((s: any) => (
            <div key={s.sessionId} className="rounded-2xl p-5" style={CARD}>
              <div className="flex flex-wrap items-center gap-3 text-[11px] mb-3" style={{ color: 'rgba(var(--text) / 0.4)' }}>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(s.startedAt).toLocaleString('en-IN')}</span>
                {s.geo?.country && <span className="flex items-center gap-1"><Globe2 className="w-3 h-3" /> {s.geo.city ? `${s.geo.city}, ` : ''}{s.geo.country}</span>}
                {s.device?.type && <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {s.device.type} · {s.device.os} · {s.device.browser}</span>}
                {s.channel && <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(var(--surface) / 0.06)' }}>{s.channel}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {s.pageViews.map((pv: any, i: number) => (
                  <div key={pv._id || i} className="flex items-center gap-1">
                    <span className="text-[11px] px-2 py-1 rounded" style={{ background: 'rgba(var(--surface) / 0.05)', color: 'rgb(var(--text))' }}>
                      {pv.path} {pv.timeOnPageSeconds ? <span style={{ color: 'rgba(var(--text) / 0.35)' }}>· {pv.timeOnPageSeconds}s</span> : ''}
                    </span>
                    {i < s.pageViews.length - 1 && <span style={{ color: 'rgba(var(--text) / 0.2)' }}>→</span>}
                  </div>
                ))}
                {s.pageViews.length === 0 && <span className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No page views recorded for this session.</span>}
              </div>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-[12px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No sessions recorded yet.</p>}
        </div>
      </div>

      {notableEvents.length > 0 && (
        <div className="rounded-2xl p-5" style={CARD}>
          <h2 className="text-[13px] font-bold mb-3" style={{ color: 'rgb(var(--text))' }}>Notable Events</h2>
          <div className="space-y-1.5">
            {notableEvents.map((e: any) => (
              <div key={e._id} className="flex items-center justify-between text-[12px]">
                <span style={{ color: 'rgba(var(--text) / 0.6)' }}>{e.type} on {e.path}</span>
                <span style={{ color: 'rgba(var(--text) / 0.3)' }}>{new Date(e.ts).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
