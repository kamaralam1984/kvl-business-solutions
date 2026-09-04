'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X, CheckCircle2, CircleDashed } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';

type Country = {
  _id?: string; slug: string; name: string; heroTitle: string; heroDescription: string;
  intro: string; status: 'draft' | 'published';
  seo: { title: string; description: string; ogImage?: string };
};

const empty: Country = {
  slug: '', name: '', heroTitle: '', heroDescription: '', intro: '', status: 'draft',
  seo: { title: '', description: '', ogImage: '' },
};

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [editing, setEditing] = useState<Country | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/countries').then(r => r.json())
      .then(d => { if (d.ok) setCountries(d.countries); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/countries' : `/api/admin/countries/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); setIsNew(false); setMsg('✓ Saved'); load(); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this country? Its location pages will remain but the hub page will 404.')) return;
    await fetch(`/api/admin/countries/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleStatus = async (c: Country) => {
    const status = c.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/admin/countries/${c._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Countries ({countries.length})</h1>
          <p className="text-[12.5px] mt-1" style={{ color: 'rgba(var(--text) / 0.35)' }}>
            The hub page at /{'{country}'} — e.g. /india. Add a new country here, then create its states/UTs under Location Pages.
          </p>
        </div>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Country</button>
      </div>

      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</div>}

      <div className="card-base overflow-hidden kpi-enter" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {countries.map(c => (
              <tr key={c._id} className="transition-colors duration-150 hover:bg-surface/[0.025]" style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: 'rgb(var(--text))' }}>{c.name}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(var(--text) / 0.4)' }}>/{c.slug}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(c)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={c.status === 'published'
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                      : { background: 'rgba(var(--surface) / 0.06)', color: 'rgba(var(--text) / 0.45)', border: '1px solid rgba(var(--border) / 0.12)' }}
                  >
                    {c.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <CircleDashed className="w-3 h-3" />}
                    {c.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(c); setIsNew(false); }} aria-label="Edit country" className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => del(c._id)} aria-label="Delete country" className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {loadError && <tr><td colSpan={4} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</td></tr>}
            {!loadError && countries.length === 0 && <tr><td colSpan={4} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No countries yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur"
          className="p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{isNew ? 'New Country' : 'Edit Country'}</h2>
            <button onClick={() => setEditing(null)} style={{ color: 'rgba(var(--text) / 0.5)' }}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            <input className="form-control" placeholder="Slug (e.g. india, uk)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} disabled={!isNew} />
            <input className="form-control" placeholder="Name (e.g. India)" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            <input className="form-control" placeholder="Hero Title" value={editing.heroTitle} onChange={e => setEditing({ ...editing, heroTitle: e.target.value })} />
            <textarea className="form-control" rows={2} placeholder="Hero Description" value={editing.heroDescription} onChange={e => setEditing({ ...editing, heroDescription: e.target.value })} />
            <textarea className="form-control" rows={2} placeholder="Intro (positioning strip under hero)" value={editing.intro} onChange={e => setEditing({ ...editing, intro: e.target.value })} />
            <select className="form-control" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Country['status'] })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input className="form-control" placeholder="SEO Title" value={editing.seo.title} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, title: e.target.value } })} />
            <textarea className="form-control" rows={2} placeholder="SEO Description" value={editing.seo.description} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, description: e.target.value } })} />
            <input className="form-control" placeholder="OG Image URL (optional)" value={editing.seo.ogImage || ''} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, ogImage: e.target.value } })} />
            <button onClick={save} className="btn btn-primary w-full justify-center">Save Country</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
