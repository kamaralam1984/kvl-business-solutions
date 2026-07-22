'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';

type Pillar = { title: string; desc: string };
type Feature = { icon: string; title: string; desc: string };
type Benefit = { title: string; desc: string };
type Faq = { q: string; a: string };
type Study = {
  _id?: string; slug: string; name: string; url: string; tagline: string;
  industry: string; industrySlug?: string; businessCategory: string; overview: string;
  heroImage: string;
  challenge: { headline: string; body: string };
  goals: string[];
  solution: { headline: string; body: string; pillars: Pillar[] };
  keyFeatures: Feature[];
  tech: string[];
  benefits: Benefit[];
  relatedServiceSlugs: string[];
  faq: Faq[];
  seo: { title: string; description: string };
};

const empty: Study = {
  slug: '', name: '', url: '', tagline: '', industry: '', businessCategory: '', overview: '',
  heroImage: '', challenge: { headline: '', body: '' }, goals: [],
  solution: { headline: '', body: '', pillars: [] }, keyFeatures: [], tech: [], benefits: [],
  relatedServiceSlugs: [], faq: [], seo: { title: '', description: '' },
};

export default function AdminCaseStudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [editing, setEditing] = useState<Study | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/case-studies').then(r => r.json()).then(d => d.ok && setStudies(d.studies));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/case-studies' : `/api/admin/case-studies/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body = isNew ? editing : { ...editing, slug: undefined };
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.ok) { setEditing(null); setIsNew(false); setMsg('✓ Saved'); load(); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this case study?')) return;
    await fetch(`/api/admin/case-studies/${id}`, { method: 'DELETE' });
    load();
  };

  const csv = (arr: string[]) => arr.join(', ');
  const fromCsv = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Case Studies ({studies.length})</h1>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Case Study</button>
      </div>
      <p className="text-[12.5px] mb-4" style={{ color: 'rgba(var(--text) / 0.35)' }}>
        This lists only case studies created here — the existing live products (VidYT, AapKaPlot, etc.) stay in code, but any new one below appears on /projects alongside them. Only one hero image is captured here (no separate desktop/tablet/mobile shots).
      </p>
      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</div>}

      <div className="card-base overflow-hidden kpi-enter" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Industry</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {studies.map(s => (
              <tr key={s._id} className="transition-colors duration-150 hover:bg-surface/[0.025]" style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: 'rgb(var(--text))' }}>{s.name}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(var(--text) / 0.4)' }}>{s.slug}</td>
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.6)' }}>{s.industry}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(s); setIsNew(false); }} className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => del(s._id)} className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {studies.length === 0 && <tr><td colSpan={4} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No admin-created case studies yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur" onClick={() => setEditing(null)}>
          <div
            className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{isNew ? 'New Case Study' : 'Edit Case Study'}</h2>
              <button onClick={() => setEditing(null)} style={{ color: 'rgba(var(--text) / 0.5)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {isNew && <input className="form-control" placeholder="slug (e.g., my-new-product)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase() })} />}
              <input className="form-control" placeholder="Product name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <input className="form-control" placeholder="Live URL (https://...)" value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} />
              <input className="form-control" placeholder="Tagline" value={editing.tagline} onChange={e => setEditing({ ...editing, tagline: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Industry" value={editing.industry} onChange={e => setEditing({ ...editing, industry: e.target.value })} />
                <input className="form-control" placeholder="Business category" value={editing.businessCategory} onChange={e => setEditing({ ...editing, businessCategory: e.target.value })} />
              </div>
              <textarea className="form-control" rows={2} placeholder="Overview (1-2 sentences)" value={editing.overview} onChange={e => setEditing({ ...editing, overview: e.target.value })} />
              <input className="form-control" placeholder="Hero image URL" value={editing.heroImage} onChange={e => setEditing({ ...editing, heroImage: e.target.value })} />

              <div className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(var(--surface) / 0.03)' }}>
                <label className="text-[11px] font-semibold uppercase" style={{ color: 'rgba(var(--text) / 0.4)' }}>Business Challenge</label>
                <input className="form-control" placeholder="Headline" value={editing.challenge.headline} onChange={e => setEditing({ ...editing, challenge: { ...editing.challenge, headline: e.target.value } })} />
                <textarea className="form-control" rows={2} placeholder="Body" value={editing.challenge.body} onChange={e => setEditing({ ...editing, challenge: { ...editing.challenge, body: e.target.value } })} />
              </div>

              <div className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(var(--surface) / 0.03)' }}>
                <label className="text-[11px] font-semibold uppercase" style={{ color: 'rgba(var(--text) / 0.4)' }}>Solution</label>
                <input className="form-control" placeholder="Headline" value={editing.solution.headline} onChange={e => setEditing({ ...editing, solution: { ...editing.solution, headline: e.target.value } })} />
                <textarea className="form-control" rows={2} placeholder="Body" value={editing.solution.body} onChange={e => setEditing({ ...editing, solution: { ...editing.solution, body: e.target.value } })} />
              </div>

              <input className="form-control" placeholder="Goals (comma-separated)" value={csv(editing.goals)} onChange={e => setEditing({ ...editing, goals: fromCsv(e.target.value) })} />
              <input className="form-control" placeholder="Tech stack (comma-separated)" value={csv(editing.tech)} onChange={e => setEditing({ ...editing, tech: fromCsv(e.target.value) })} />
              <input className="form-control" placeholder="Related service slugs (comma-separated)" value={csv(editing.relatedServiceSlugs)} onChange={e => setEditing({ ...editing, relatedServiceSlugs: fromCsv(e.target.value) })} />

              <input className="form-control" placeholder="SEO title" value={editing.seo.title} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, title: e.target.value } })} />
              <textarea className="form-control" rows={2} placeholder="SEO description" value={editing.seo.description} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, description: e.target.value } })} />

              <button onClick={save} className="btn btn-primary w-full justify-center">Save Case Study</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
