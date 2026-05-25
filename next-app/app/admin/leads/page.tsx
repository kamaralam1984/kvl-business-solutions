'use client';
import { useEffect, useState } from 'react';
import { Search, Trash2, MessageSquare, X, TrendingUp, Users, PhoneCall, Trophy } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';

const STATUS_OPTS = ['new', 'contacted', 'qualified', 'won', 'lost'];
const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-500',
  contacted: 'bg-yellow-500/20 text-yellow-500',
  qualified: 'bg-purple-500/20 text-purple-500',
  won: 'bg-green-500/20 text-green-500',
  lost: 'bg-slate-500/20 text-slate-500',
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [preview, setPreview] = useState<any>(null);

  const load = async (search = q, status = statusFilter) => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (status) p.set('status', status);
    const d = await fetch(`/api/admin/leads?${p}`).then(r => r.json());
    if (d.ok) { setLeads(d.leads); setStats(d.stats); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete lead "${name}"?`)) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    load();
  };

  const filterBy = (status: string) => { setStatusFilter(status); load(q, status); };

  const statCards = [
    { label: 'Total Leads', value: stats.total || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'New', value: stats.new || 0, icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'In Progress', value: stats.contacted || 0, icon: PhoneCall, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Won', value: stats.won || 0, icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/10' },
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
              {s ? s.toUpperCase() : 'ALL'} {s === '' && `(${stats.total || 0})`}
              {s === 'new' && ` (${stats.new || 0})`}
              {s === 'won' && ` (${stats.won || 0})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, phone…" className="form-control pl-9 w-64" />
          </form>
          <ExportButton type="leads" />
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint bg-surface">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Contact</th>
              <th className="p-3">Service</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l: any) => (
              <tr key={l._id} className="border-b border-tint hover:bg-primary/5 transition-colors">
                <td className="p-3 text-xs text-text2 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-text2">{l.source || 'contact-form'}</div>
                </td>
                <td className="p-3 text-xs">
                  <div>{l.email}</div>
                  <div className="text-text2">{l.phone}</div>
                </td>
                <td className="p-3 text-xs text-text2">{l.service || '—'}</td>
                <td className="p-3">
                  <select value={l.status || 'new'} onChange={e => updateStatus(l._id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLOR[l.status || 'new']}`}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {l.message && (
                      <button onClick={() => setPreview(l)} className="p-1 text-text2 hover:text-primary" title="View message">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => del(l._id, l.name)} className="p-1 text-text2 hover:text-red-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center">
                <Users className="w-10 h-10 text-text2 mx-auto mb-2 opacity-40" />
                <p className="text-text2 font-medium">No leads found</p>
                <p className="text-xs text-text2 mt-1">Leads from contact form will appear here</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Message Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{preview.name}</h3>
                <p className="text-xs text-text2">{preview.email} · {preview.phone}</p>
              </div>
              <button onClick={() => setPreview(null)}><X className="w-5 h-5 text-text2" /></button>
            </div>
            <div className="bg-tint rounded-xl p-4 text-sm text-text2 whitespace-pre-wrap">{preview.message}</div>
            {preview.service && <p className="mt-3 text-xs text-text2">Service: <span className="font-semibold text-text">{preview.service}</span></p>}
          </div>
        </div>
      )}
    </div>
  );
}
