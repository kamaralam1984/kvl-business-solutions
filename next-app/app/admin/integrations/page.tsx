'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Plug } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type Item = { key: string; label: string; configured: boolean };
type Group = { category: string; items: Item[] };

export default function AdminIntegrationsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [total, setTotal] = useState(0);
  const [configuredCount, setConfiguredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/integrations')
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setGroups(d.groups); setTotal(d.total); setConfiguredCount(d.configuredCount); }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
            Integration Status
          </h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Which third-party services are wired up — a missing key means that feature silently no-ops instead of failing.
          </p>
        </div>
        {!loading && (
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold shrink-0"
            style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e' }}
          >
            <Plug className="w-4 h-4" /> {configuredCount} / {total} configured
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1].map(i => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <AdminSkeleton rows={4} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 stagger-children">
          {groups.map(group => (
            <div
              key={group.category}
              className="admin-card-hover kpi-enter rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}
            >
              <h2 className="text-[13px] font-bold mb-3.5" style={{ color: 'rgb(var(--text))' }}>{group.category}</h2>
              <div className="space-y-2">
                {group.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-3 py-1.5">
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium truncate" style={{ color: 'rgba(var(--text) / 0.7)' }}>{item.label}</div>
                      <div className="text-[10.5px] font-mono truncate" style={{ color: 'rgba(var(--text) / 0.25)' }}>{item.key}</div>
                    </div>
                    {item.configured ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold shrink-0" style={{ color: '#4ade80' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold shrink-0" style={{ color: 'rgba(var(--text) / 0.3)' }}>
                        <XCircle className="w-3.5 h-3.5" /> Missing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
