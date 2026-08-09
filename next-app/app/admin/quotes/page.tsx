'use client';
import { useEffect, useState } from 'react';
import { Search, Trash2, FileText, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';

const STATUS_OPTS = ['submitted', 'follow-up', 'closed', 'draft'];
const STATUS_COLOR: Record<string, string> = {
  submitted: 'bg-blue-500/20 text-blue-500',
  'follow-up': 'bg-yellow-500/20 text-yellow-500',
  closed: 'bg-green-500/20 text-green-500',
  draft: 'bg-slate-500/20 text-slate-500',
};

const formatINR = (n: number) => n ? `₹${n.toLocaleString('en-IN')}` : '—';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = async (search = q, status = statusFilter) => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (status) p.set('status', status);
    setLoadError(false);
    try {
      const d = await fetch(`/api/admin/quotes?${p}`).then(r => r.json());
      if (d.ok) { setQuotes(d.quotes); setStats(d.stats); }
      else setLoadError(true);
    } catch {
      setLoadError(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/quotes/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this quote request?')) return;
    await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
    load();
  };

  const filterBy = (status: string) => { setStatusFilter(status); load(q, status); };

  const statCards = [
    { label: 'Total Quotes', value: stats.total || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Submitted', value: stats.submitted || 0, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Follow-up', value: stats.followUp || 0, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Avg. Value', value: stats.total ? `₹${Math.round((stats.totalValue || 0) / stats.total).toLocaleString('en-IN')}` : '₹0', icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="card-base p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div><div className="text-2xl font-extrabold">{s.value}</div><div className="text-xs text-text2">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {['', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => filterBy(s)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'surface-tint text-text2 hover:text-text'}`}>
              {s ? s.toUpperCase() : `ALL (${stats.total || 0})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email…" className="form-control pl-9 w-64" />
          </form>
          <ExportButton type="quotes" />
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint bg-surface">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Contact</th><th className="p-3">Type / Scope</th>
              <th className="p-3">Timeline</th><th className="p-3">Estimate</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q: any) => (
              <tr key={q._id} className="border-b border-tint hover:bg-primary/5 transition-colors">
                <td className="p-3 text-xs text-text2 whitespace-nowrap">{new Date(q.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3">
                  <div className="font-semibold">{q.contact?.name || '—'}</div>
                  <div className="text-xs text-text2">{q.contact?.email}</div>
                  <div className="text-xs text-text2">{q.contact?.phone}</div>
                </td>
                <td className="p-3 text-xs">
                  <div className="font-medium">{q.type || '—'}</div>
                  <div className="text-text2 line-clamp-2">{q.scope}</div>
                </td>
                <td className="p-3 text-xs text-text2">{q.timeline || '—'}</td>
                <td className="p-3 text-xs font-bold text-primary whitespace-nowrap">
                  {q.estimateLow ? `${formatINR(q.estimateLow)} – ${formatINR(q.estimateHigh)}` : '—'}
                </td>
                <td className="p-3">
                  <select value={q.status || 'submitted'} onChange={e => updateStatus(q._id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLOR[q.status || 'submitted']}`}>
                    {STATUS_OPTS.map(s => <option key={s} value={s} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.toUpperCase()}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => del(q._id)} aria-label="Delete quote" className="p-1 text-text2 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center">
                <FileText className="w-10 h-10 text-text2 mx-auto mb-2 opacity-40" />
                {loadError ? (
                  <>
                    <p className="text-text2 font-medium">Failed to load quote requests</p>
                    <p className="text-xs text-text2 mt-1">Check your connection and try refreshing.</p>
                  </>
                ) : (
                  <>
                    <p className="text-text2 font-medium">No quote requests yet</p>
                    <p className="text-xs text-text2 mt-1">Quote requests from the website will appear here</p>
                  </>
                )}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
