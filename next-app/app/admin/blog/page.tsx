'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';

type Section = { heading: string; content: string };
type Faq = { q: string; a: string };
type Post = {
  _id?: string; slug: string; title: string; excerpt: string; publishedAt: string;
  updatedAt?: string; author?: string; category: string; readingTimeMinutes: number;
  body: Section[]; relatedServiceSlugs: string[]; relatedIndustrySlugs: string[];
  faq: Faq[]; seo: { title: string; description: string };
};

const empty: Post = {
  slug: '', title: '', excerpt: '', publishedAt: new Date().toISOString().slice(0, 10),
  author: '', category: '', readingTimeMinutes: 5, body: [{ heading: '', content: '' }],
  relatedServiceSlugs: [], relatedIndustrySlugs: [], faq: [],
  seo: { title: '', description: '' },
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/blog').then(r => r.json())
      .then(d => { if (d.ok) setPosts(d.posts); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body = isNew ? editing : { ...editing, slug: undefined };
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.ok) { setEditing(null); setIsNew(false); setMsg('✓ Saved'); load(); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    load();
  };

  const updateSection = (i: number, key: keyof Section, val: string) => {
    if (!editing) return;
    const body = [...editing.body];
    body[i] = { ...body[i], [key]: val };
    setEditing({ ...editing, body });
  };

  const updateFaq = (i: number, key: keyof Faq, val: string) => {
    if (!editing) return;
    const faq = [...editing.faq];
    faq[i] = { ...faq[i], [key]: val };
    setEditing({ ...editing, faq });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Blog Posts ({posts.length})</h1>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Post</button>
      </div>
      <p className="text-[12.5px] mb-4" style={{ color: 'rgba(var(--text) / 0.35)' }}>
        This lists only posts created here — the existing hand-written articles stay in code, but any new post below appears on /blog alongside them.
      </p>
      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</div>}

      <div className="card-base overflow-hidden kpi-enter" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <tr><th className="p-3">Title</th><th className="p-3">Slug</th><th className="p-3">Category</th><th className="p-3">Published</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id} className="transition-colors duration-150 hover:bg-surface/[0.025]" style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: 'rgb(var(--text))' }}>{p.title}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(var(--text) / 0.4)' }}>{p.slug}</td>
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.6)' }}>{p.category}</td>
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.4)' }}>{p.publishedAt}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => del(p._id)} className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {loadError && <tr><td colSpan={5} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</td></tr>}
            {!loadError && posts.length === 0 && <tr><td colSpan={5} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No admin-created posts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur"
          className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}
        >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{isNew ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={() => setEditing(null)} style={{ color: 'rgba(var(--text) / 0.5)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {isNew && <input className="form-control" placeholder="slug (e.g., how-to-choose-crm)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase() })} />}
              <input className="form-control" placeholder="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              <textarea className="form-control" rows={2} placeholder="Excerpt" value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} />
              <div className="grid grid-cols-3 gap-2">
                <input className="form-control" placeholder="Category" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} />
                <input className="form-control" type="date" value={editing.publishedAt} onChange={e => setEditing({ ...editing, publishedAt: e.target.value })} />
                <input className="form-control" type="number" placeholder="Reading mins" value={editing.readingTimeMinutes} onChange={e => setEditing({ ...editing, readingTimeMinutes: Number(e.target.value) })} />
              </div>
              <input className="form-control" placeholder="Author (optional — defaults to KVL TECH Editorial Team)" value={editing.author || ''} onChange={e => setEditing({ ...editing, author: e.target.value })} />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase" style={{ color: 'rgba(var(--text) / 0.4)' }}>Body Sections</label>
                  <button onClick={() => setEditing({ ...editing, body: [...editing.body, { heading: '', content: '' }] })} className="text-[11px] font-semibold" style={{ color: '#c8a96e' }}>+ Add Section</button>
                </div>
                <div className="space-y-2.5">
                  {editing.body.map((s, i) => (
                    <div key={i} className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(var(--surface) / 0.03)' }}>
                      <div className="flex gap-2">
                        <input className="form-control flex-1" placeholder="Section heading" value={s.heading} onChange={e => updateSection(i, 'heading', e.target.value)} />
                        <button onClick={() => setEditing({ ...editing, body: editing.body.filter((_, idx) => idx !== i) })} style={{ color: 'rgba(var(--text) / 0.3)' }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <textarea className="form-control w-full" rows={3} placeholder="Section content" value={s.content} onChange={e => updateSection(i, 'content', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase" style={{ color: 'rgba(var(--text) / 0.4)' }}>FAQ</label>
                  <button onClick={() => setEditing({ ...editing, faq: [...editing.faq, { q: '', a: '' }] })} className="text-[11px] font-semibold" style={{ color: '#c8a96e' }}>+ Add FAQ</button>
                </div>
                <div className="space-y-2">
                  {editing.faq.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(var(--surface) / 0.03)' }}>
                      <div className="flex gap-2">
                        <input className="form-control flex-1" placeholder="Question" value={f.q} onChange={e => updateFaq(i, 'q', e.target.value)} />
                        <button onClick={() => setEditing({ ...editing, faq: editing.faq.filter((_, idx) => idx !== i) })} style={{ color: 'rgba(var(--text) / 0.3)' }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <textarea className="form-control w-full" rows={2} placeholder="Answer" value={f.a} onChange={e => updateFaq(i, 'a', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <input className="form-control" placeholder="Related service slugs (comma-separated)" value={editing.relatedServiceSlugs.join(', ')} onChange={e => setEditing({ ...editing, relatedServiceSlugs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              <input className="form-control" placeholder="Related industry slugs (comma-separated)" value={editing.relatedIndustrySlugs.join(', ')} onChange={e => setEditing({ ...editing, relatedIndustrySlugs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />

              <input className="form-control" placeholder="SEO title" value={editing.seo.title} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, title: e.target.value } })} />
              <textarea className="form-control" rows={2} placeholder="SEO description" value={editing.seo.description} onChange={e => setEditing({ ...editing, seo: { ...editing.seo, description: e.target.value } })} />

              <button onClick={save} className="btn btn-primary w-full justify-center">Save Post</button>
            </div>
        </Modal>
      )}
    </div>
  );
}
