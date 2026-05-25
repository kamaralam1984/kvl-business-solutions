'use client';
import { useEffect, useState } from 'react';
import { Search, Trash2, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  confirmed: 'bg-blue-500/20 text-blue-500',
  completed: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

const ACTION_BTNS: Record<string, { next: string; label: string; cls: string }[]> = {
  pending: [{ next: 'confirmed', label: 'Confirm', cls: 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' }, { next: 'cancelled', label: 'Cancel', cls: 'bg-red-500/20 text-red-500 hover:bg-red-500/30' }],
  confirmed: [{ next: 'completed', label: 'Complete', cls: 'bg-green-500/20 text-green-500 hover:bg-green-500/30' }, { next: 'cancelled', label: 'Cancel', cls: 'bg-red-500/20 text-red-500 hover:bg-red-500/30' }],
  completed: [],
  cancelled: [{ next: 'pending', label: 'Reopen', cls: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' }],
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async (search = q, status = statusFilter) => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (status) p.set('status', status);
    const d = await fetch(`/api/admin/bookings?${p}`).then(r => r.json());
    if (d.ok) { setBookings(d.bookings); setStats(d.stats); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete booking for "${name}"?`)) return;
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    load();
  };

  const filterBy = (status: string) => { setStatusFilter(status); load(q, status); };

  const statCards = [
    { label: 'Total', value: stats.total || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pending', value: stats.pending || 0, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Confirmed', value: stats.confirmed || 0, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: stats.completed || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
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
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => filterBy(s)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'surface-tint text-text2 hover:text-text'}`}>
              {s ? s.toUpperCase() : `ALL (${stats.total || 0})`}
              {s === 'pending' && stats.pending ? ` (${stats.pending})` : ''}
            </button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text2" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email…" className="form-control pl-9 w-64" />
        </form>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint bg-surface">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Contact</th>
              <th className="p-3">Product</th><th className="p-3">Preferred Slot</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b._id} className="border-b border-tint hover:bg-primary/5 transition-colors">
                <td className="p-3 text-xs text-text2 whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3">
                  <div className="font-semibold">{b.name}</div>
                  {b.company && <div className="text-xs text-text2">{b.company}</div>}
                </td>
                <td className="p-3 text-xs"><div>{b.email}</div><div className="text-text2">{b.phone}</div></td>
                <td className="p-3 text-xs font-medium">{b.product || '—'}</td>
                <td className="p-3 text-xs text-text2">
                  {b.preferredDate ? `${new Date(b.preferredDate).toLocaleDateString('en-IN')} ${b.preferredTime || ''}` : 'Flexible'}
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[b.status] || ''}`}>
                    {b.status?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    {(ACTION_BTNS[b.status] || []).map(a => (
                      <button key={a.next} onClick={() => updateStatus(b._id, a.next)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.cls}`}>
                        {a.label}
                      </button>
                    ))}
                    <button onClick={() => del(b._id, b.name)} className="p-1 text-text2 hover:text-red-500 ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center">
                <Calendar className="w-10 h-10 text-text2 mx-auto mb-2 opacity-40" />
                <p className="text-text2 font-medium">No demo bookings yet</p>
                <p className="text-xs text-text2 mt-1">Bookings from the website will appear here</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
