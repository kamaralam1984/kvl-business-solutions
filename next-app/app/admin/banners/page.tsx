'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Megaphone } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';

type Banner = {
  _id?: string;
  text: string;
  link?: string;
  linkText?: string;
  active: boolean;
  variant: 'info' | 'success' | 'warning' | 'promo';
  dismissible: boolean;
};

const empty: Banner = { text: '', link: '', linkText: 'Learn more', active: true, variant: 'promo', dismissible: true };

const variantColors: Record<string, string> = {
  info: 'bg-blue-500/15 text-blue-500',
  success: 'bg-green-500/15 text-green-500',
  warning: 'bg-yellow-500/15 text-yellow-500',
  promo: 'bg-primary/15 text-primary',
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/banners').then(r => r.json())
      .then(d => { if (d.ok) setBanners(d.banners); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/banners' : `/api/admin/banners/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); }
  };

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/admin/banners/${b._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !b.active }) });
    load();
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this banner?')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Megaphone className="w-6 h-6 text-primary" /> Banners</h1>
          <p className="text-text2 text-sm mt-1">Show a promotional strip at the top of every page. Only the latest active one is shown.</p>
        </div>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Banner</button>
      </div>

      <div className="space-y-3">
        {loadError && <div className="card-base p-8 text-center text-text2">Failed to load — check your connection and try refreshing.</div>}
        {!loadError && banners.length === 0 && <div className="card-base p-8 text-center text-text2">No banners yet. Create one — example: &quot;🎉 25% off this month — code LAUNCH25&quot;</div>}
        {banners.map(b => (
          <div key={b._id} className="card-base p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${variantColors[b.variant]}`}>{b.variant.toUpperCase()}</span>
                <button onClick={() => toggleActive(b)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full hover:opacity-80 ${b.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                  {b.active ? 'LIVE' : 'OFF'}
                </button>
              </div>
              <p className="text-sm">{b.text}</p>
              {b.link && <p className="text-xs text-primary mt-1">→ {b.link}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setEditing(b); setIsNew(false); }} className="text-text2 hover:text-primary p-1.5"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => del(b._id)} aria-label="Delete banner" className="text-text2 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" className="card-base p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'New Banner' : 'Edit Banner'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <textarea className="form-control" rows={2} placeholder="🎉 25% off this month — use code LAUNCH25" value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Link (optional, e.g., /pricing)" value={editing.link || ''} onChange={e => setEditing({ ...editing, link: e.target.value })} />
                <input className="form-control" placeholder="Link text" value={editing.linkText || ''} onChange={e => setEditing({ ...editing, linkText: e.target.value })} />
              </div>
              <select className="form-control" value={editing.variant} onChange={e => setEditing({ ...editing, variant: e.target.value as any })}>
                <option value="promo" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Promo (primary color)</option>
                <option value="info" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Info (blue)</option>
                <option value="success" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Success (green)</option>
                <option value="warning" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Warning (yellow)</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.dismissible} onChange={e => setEditing({ ...editing, dismissible: e.target.checked })} /> Dismissible</label>
              </div>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
        </Modal>
      )}
    </div>
  );
}
