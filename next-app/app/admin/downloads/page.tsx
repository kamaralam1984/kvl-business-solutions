'use client';
import { useEffect, useState } from 'react';
import { Download, Users, ExternalLink } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type Doc = { type: string; label: string; href: string; downloads: number; interested: number };
type LogEntry = { type: string; downloadedAt: string };

export default function AdminDownloadsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [recent, setRecent] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/downloads').then(r => r.json()).then(d => { if (d.ok) { setDocs(d.docs); setRecent(d.recent); } }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: '#f0ede6' }}>
          Downloads
        </h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          These 3 documents are generated on the fly from your services/case-studies content — there's no file to swap, but here's who's downloading them.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #0f0f12 0%, #111114 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <AdminSkeleton rows={3} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 stagger-children">
            {docs.map(d => (
              <div key={d.type} className="admin-card-hover kpi-enter rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #0f0f12 0%, #111114 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[13px] font-bold" style={{ color: '#f0ede6' }}>{d.label}</h2>
                  <a href={d.href} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.3)' }}><ExternalLink className="w-3.5 h-3.5" /></a>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <Download className="w-3.5 h-3.5" style={{ color: '#c8a96e' }} /> Downloads
                    </div>
                    <div className="text-xl font-extrabold mt-1" style={{ color: '#f0ede6' }}>{d.downloads}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <Users className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} /> Leads Captured
                    </div>
                    <div className="text-xl font-extrabold mt-1" style={{ color: '#f0ede6' }}>{d.interested}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #0f0f12 0%, #111114 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-[13px] font-bold mb-3" style={{ color: '#f0ede6' }}>Recent Downloads</h2>
            {recent.length === 0 ? (
              <p className="text-[12.5px]" style={{ color: 'rgba(255,255,255,0.3)' }}>No downloads yet.</p>
            ) : (
              <div className="space-y-1.5">
                {recent.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[12.5px] py-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span>{docs.find(d => d.type === r.type)?.label || r.type}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>{new Date(r.downloadedAt).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
