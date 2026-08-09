'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Save, Tag, Percent, IndianRupee } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { Modal } from '@/components/shared/Modal';

type Coupon = {
  _id?: string;
  code: string;
  description?: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount?: number;
  productSlugs?: string[];
  validUntil?: string;
  active: boolean;
};

const empty: Coupon = { code: '', description: '', type: 'percent', value: 10, minOrderAmount: 0, maxUses: 0, productSlugs: [], active: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/coupons').then(r => r.json()).then(d => {
      if (d.ok) setCoupons(d.coupons); else setLoadError(true);
    }).catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const r = await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); setMsg('✓ Saved'); }
    else setMsg(`Error: ${d.error}`);
  };

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !c.active }) });
    load();
  };

  const del = async (c: Coupon) => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    await fetch(`/api/admin/coupons/${c._id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Coupons ({coupons.length})</h1>
        <button onClick={() => setEditing(empty)} className="btn btn-primary"><Plus className="w-4 h-4" /> New Coupon</button>
      </div>
      {msg && <div className="text-xs mb-3">{msg}</div>}

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Used</th><th className="p-3">Expires</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c._id} className="border-b border-tint">
                <td className="p-3 font-mono font-bold">{c.code}</td>
                <td className="p-3 text-xs">{c.type === 'percent' ? <><Percent className="w-3 h-3 inline" /> Percent</> : <><IndianRupee className="w-3 h-3 inline" /> Fixed</>}</td>
                <td className="p-3 font-semibold">{c.type === 'percent' ? `${c.value}%` : formatINR(c.value)}</td>
                <td className="p-3 text-xs text-text2">{c.usedCount || 0}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td className="p-3 text-xs text-text2">{c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN') : '—'}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(c)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full hover:opacity-80 ${c.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                    {c.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => del(c)} aria-label="Delete coupon" className="text-text2 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-text2">
                {loadError ? 'Failed to load coupons — check your connection and try refreshing.' : <>No coupons yet. Click &quot;New Coupon&quot; to create one.</>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" className="card-base p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold flex items-center gap-2"><Tag className="w-5 h-5 text-primary" /> New Coupon</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control font-mono" placeholder="CODE (e.g., LAUNCH20)" value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
              <input className="form-control" placeholder="Description (internal)" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <select className="form-control" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as any })}>
                  <option value="percent" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Percent off</option>
                  <option value="fixed" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Fixed ₹ off</option>
                </select>
                <input className="form-control" type="number" placeholder={editing.type === 'percent' ? '10' : '500'} value={editing.value || ''} onChange={e => setEditing({ ...editing, value: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" type="number" placeholder="Min order amount" value={editing.minOrderAmount || ''} onChange={e => setEditing({ ...editing, minOrderAmount: parseInt(e.target.value) || 0 })} />
                <input className="form-control" type="number" placeholder="Max uses (0=unlimited)" value={editing.maxUses || ''} onChange={e => setEditing({ ...editing, maxUses: parseInt(e.target.value) || 0 })} />
              </div>
              <input className="form-control" type="date" placeholder="Valid until" value={editing.validUntil?.slice(0, 10) || ''} onChange={e => setEditing({ ...editing, validUntil: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Coupon</button>
            </div>
        </Modal>
      )}
    </div>
  );
}
