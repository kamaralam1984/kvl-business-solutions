'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Globe, ExternalLink, Sparkles, Download } from 'lucide-react';
import { FileUploader, UploadedFile } from '@/components/widgets/FileUploader';
import { DEMO_CATEGORIES } from '@/lib/data/demo-categories';

type Demo = {
  _id?: string;
  name: string;
  description?: string;
  url?: string;
  category: string;
  technologies: string[];
  live: boolean;
  image?: string;
  imagePublicId?: string;
  iconName: string;
  c1: string;
  c2: string;
  order: number;
  active: boolean;
  startingPrice: number;
};

const empty: Demo = {
  name: '', description: '', url: '', category: 'business',
  technologies: [], live: false, image: '', imagePublicId: '',
  iconName: 'Globe', c1: '#3b82f6', c2: '#1d4ed8',
  order: 0, active: true, startingPrice: 14999,
};

const ICON_OPTIONS = ['Globe', 'Briefcase', 'Building2', 'GraduationCap', 'Hospital', 'HardHat', 'Satellite', 'ShoppingCart', 'Cog', 'Landmark', 'UserSquare', 'Video', 'Home', 'Smartphone', 'Code'];

export default function AdminDemosPage() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [editing, setEditing] = useState<Demo | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/demos').then(r => r.json()).then(d => d.ok && setDemos(d.demos));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/demos' : `/api/admin/demos/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); setMsg('✓ Saved'); }
    else setMsg(`Error: ${d.error}`);
  };

  const toggle = async (demo: Demo, field: 'active' | 'live') => {
    await fetch(`/api/admin/demos/${demo._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: !demo[field] }) });
    load();
  };

  const del = async (d: Demo) => {
    if (!confirm(`Delete "${d.name}"? This is permanent.`)) return;
    await fetch(`/api/admin/demos/${d._id}`, { method: 'DELETE' });
    load();
  };

  const seedDefaults = async () => {
    if (!confirm('Add 11 default demos (Vidyt, Aapka Plot, + 9 design templates)? Existing demos with same names will be skipped.')) return;
    const r = await fetch('/api/admin/demos/seed', { method: 'POST' });
    const d = await r.json();
    setMsg(d.ok ? `✓ Added ${d.added}, skipped ${d.skipped} (already exist)` : `Error: ${d.error}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Globe className="w-6 h-6 text-primary" /> Website Demos</h1>
          <p className="text-text2 text-sm mt-1">Manage what's shown on /website-demos page. Real client work (LIVE badge) + design templates.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedDefaults} className="btn btn-ghost text-xs" title="Add 11 default demos (Vidyt, Aapka Plot + 9 templates)"><Download className="w-3.5 h-3.5" /> Seed Defaults</button>
          <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> Add Website</button>
        </div>
      </div>
      {msg && <div className="text-xs mb-3">{msg}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demos.length === 0 && (
          <div className="col-span-full card-base p-10 text-center">
            <Globe className="w-12 h-12 mx-auto text-text2 opacity-30 mb-3" />
            <p className="text-text2 text-sm">No demos yet. Click "Add Website" to add your first one.</p>
            <p className="text-xs text-text2 mt-2">Example: vidyt.com, aapkaplote.com</p>
          </div>
        )}
        {demos.map(d => (
          <div key={d._id} className={`card-base overflow-hidden ${d.live ? 'ring-2 ring-green-500/50' : ''} ${!d.active ? 'opacity-50' : ''}`}>
            <div className="h-32 relative grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})` }}>
              <Globe className="w-12 h-12 opacity-80" />
              {d.live && (
                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                </span>
              )}
              {!d.active && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">HIDDEN</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-bold flex items-center gap-1">{d.name}{d.live && <Sparkles className="w-3.5 h-3.5 text-green-500" />}</h3>
                <span className="text-[10px] text-text2 uppercase tracking-wider">{d.category}</span>
              </div>
              <p className="text-xs text-text2 line-clamp-2">{d.description}</p>
              {d.url && (
                <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-primary mt-2 inline-flex items-center gap-1 hover:underline">
                  <ExternalLink className="w-3 h-3" /> {d.url.replace(/^https?:\/\//, '')}
                </a>
              )}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {d.technologies.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full surface2-tint border border-tint text-text2">{t}</span>
                ))}
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-tint">
                <button onClick={() => { setEditing(d); setIsNew(false); }} className="btn btn-ghost text-xs flex-1 justify-center"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => toggle(d, 'active')} className={`btn text-xs ${d.active ? 'btn-ghost' : 'btn-primary'}`}>{d.active ? 'Hide' : 'Show'}</button>
                <button onClick={() => toggle(d, 'live')} className={`btn text-xs ${d.live ? 'btn-ghost' : 'btn-primary'}`}>{d.live ? 'Unmark Live' : 'Mark Live'}</button>
                <button onClick={() => del(d)} className="text-text2 hover:text-red-500 p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'Add Website' : 'Edit Website'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs text-text2 mb-1 block">Name *</label>
                <input className="form-control" placeholder="e.g., Vidyt, Aapka Plot" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div><label className="text-xs text-text2 mb-1 block">Description</label>
                <textarea className="form-control" rows={2} placeholder="Short 1-line description" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div><label className="text-xs text-text2 mb-1 block">Live URL (https://...) — leave empty for sample design</label>
                <input className="form-control" placeholder="https://vidyt.com" value={editing.url || ''} onChange={e => setEditing({ ...editing, url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-text2 mb-1 block">Category</label>
                  <select className="form-control" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                    {DEMO_CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{c.label}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-text2 mb-1 block">Icon</label>
                  <select className="form-control" value={editing.iconName} onChange={e => setEditing({ ...editing, iconName: e.target.value })}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-text2 mb-1 block">Technologies (comma-separated)</label>
                <input className="form-control" placeholder="React, Tailwind, Production" value={editing.technologies.join(', ')} onChange={e => setEditing({ ...editing, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-text2 mb-1 block">Gradient color 1</label>
                  <input className="form-control" type="color" value={editing.c1} onChange={e => setEditing({ ...editing, c1: e.target.value })} />
                </div>
                <div><label className="text-xs text-text2 mb-1 block">Gradient color 2</label>
                  <input className="form-control" type="color" value={editing.c2} onChange={e => setEditing({ ...editing, c2: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-text2 mb-1 block">Display order (lower = first)</label>
                  <input className="form-control" type="number" value={editing.order} onChange={e => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} />
                </div>
                <div><label className="text-xs text-text2 mb-1 block">Starting price (₹)</label>
                  <input className="form-control" type="number" value={editing.startingPrice} onChange={e => setEditing({ ...editing, startingPrice: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="text-xs text-text2 mb-1 block">Preview image (optional)</label>
                <FileUploader folder="kvl/products" multiple={false} accept="image/*" maxSizeMB={10}
                  value={editing.image ? [{ url: editing.image, publicId: editing.imagePublicId || '', name: 'image', size: 0, format: 'jpg' }] : []}
                  onChange={files => setEditing({ ...editing, image: files[0]?.url || '', imagePublicId: files[0]?.publicId || '' })}
                />
              </div>
              <div className="flex gap-4 pt-2 border-t border-tint">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.live} onChange={e => setEditing({ ...editing, live: e.target.checked })} />
                  <span><b>LIVE</b> (real production site — green badge)</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
                  <span>Active (visible on public page)</span>
                </label>
              </div>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
