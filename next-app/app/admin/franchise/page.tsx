'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Save, Building2, Copy, Check } from 'lucide-react';
import { formatINR } from '@/lib/utils';

type Franchise = {
  _id?: string;
  ownerEmail: string;
  name: string;
  city?: string;
  state?: string;
  status: 'active' | 'paused' | 'closed';
  monthlyTarget: number;
  commissionRate: number;
  referralCode?: string;
  leadsCount?: number;
  ordersCount?: number;
  revenue?: number;
  commission?: number;
};

const empty: Franchise = { ownerEmail: '', name: '', city: '', state: '', status: 'active', monthlyTarget: 100000, commissionRate: 10 };

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-green-500/20 text-green-500',
  paused: 'bg-yellow-500/20 text-yellow-500',
  closed: 'bg-slate-500/20 text-slate-500',
};

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[11px] font-mono text-text2 hover:text-primary"
      title="Copy their referral link"
    >
      {code} {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function AdminFranchisePage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [editing, setEditing] = useState<Franchise | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/franchise').then(r => r.json()).then(d => d.ok && setFranchises(d.franchises));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/franchise' : `/api/admin/franchise/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); setMsg('✓ Saved'); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (f: Franchise) => {
    if (!confirm(`Remove franchise partner "${f.name}"? This does not delete their orders/leads.`)) return;
    await fetch(`/api/admin/franchise/${f._id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <h1 className="text-2xl font-extrabold flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> Franchise Partners ({franchises.length})</h1>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Partner</button>
      </div>
      <p className="text-xs text-text2 mb-4">Each partner gets a referral link — revenue/commission below is only for leads/orders that came through it.</p>
      {msg && <div className="text-xs mb-3">{msg}</div>}

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Partner</th><th className="p-3">Territory</th><th className="p-3">Link</th><th className="p-3">Leads / Orders</th><th className="p-3">Revenue / Commission</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {franchises.map(f => (
              <tr key={f._id} className="border-b border-tint">
                <td className="p-3">
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-[11px] text-text2">{f.ownerEmail}</div>
                </td>
                <td className="p-3 text-xs text-text2">{f.city}{f.state ? `, ${f.state}` : ''}</td>
                <td className="p-3">{f.referralCode && <CopyCode code={f.referralCode} />}</td>
                <td className="p-3 text-xs">{f.leadsCount || 0} / {f.ordersCount || 0}</td>
                <td className="p-3 text-xs">
                  <div className="font-semibold">{formatINR(f.revenue || 0)}</div>
                  <div className="text-green-500">{formatINR(f.commission || 0)} ({f.commissionRate}%)</div>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[f.status]}`}>{f.status.toUpperCase()}</span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => { setEditing(f); setIsNew(false); }} className="text-text2 hover:text-primary p-1 text-xs mr-1">Edit</button>
                  <button onClick={() => del(f)} className="text-text2 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {franchises.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-text2">No franchise partners yet. Click &quot;New Partner&quot; to add one.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> {isNew ? 'New' : 'Edit'} Franchise Partner</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control" placeholder="Partner / business name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <input
                className="form-control" type="email" placeholder="Owner's account email" value={editing.ownerEmail}
                disabled={!isNew}
                onChange={e => setEditing({ ...editing, ownerEmail: e.target.value })}
              />
              {!isNew && <p className="text-[10px] text-text2 -mt-2">Email can&apos;t be changed after creation — remove and re-add if needed.</p>}
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="City" value={editing.city || ''} onChange={e => setEditing({ ...editing, city: e.target.value })} />
                <input className="form-control" placeholder="State" value={editing.state || ''} onChange={e => setEditing({ ...editing, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" type="number" placeholder="Monthly target ₹" value={editing.monthlyTarget || ''} onChange={e => setEditing({ ...editing, monthlyTarget: parseInt(e.target.value) || 0 })} />
                <input className="form-control" type="number" placeholder="Commission %" value={editing.commissionRate ?? ''} onChange={e => setEditing({ ...editing, commissionRate: parseFloat(e.target.value) || 0 })} />
              </div>
              <select className="form-control" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as any })}>
                <option value="active" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Active</option>
                <option value="paused" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Paused</option>
                <option value="closed" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Closed</option>
              </select>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Partner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
