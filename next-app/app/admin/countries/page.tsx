'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit3, Search, Globe2, CheckCircle2, CircleDashed, ExternalLink } from 'lucide-react';

type Country = {
  _id: string; slug: string; name: string; status: 'draft' | 'published';
  pageType: 'hub' | 'standalone'; updatedAt: string;
};

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/countries').then(r => r.json())
      .then(d => { if (d.ok) setCountries(d.countries); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => countries.filter(c => {
    if (typeFilter !== 'all' && c.pageType !== typeFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !c.slug.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [countries, q, typeFilter, statusFilter]);

  const del = async (id: string) => {
    if (!confirm('Delete this country page? This cannot be undone.')) return;
    await fetch(`/api/admin/countries/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleStatus = async (c: Country) => {
    const status = c.status === 'published' ? 'draft' : 'published';
    const r = await fetch(`/api/admin/countries/${c._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const d = await r.json();
    if (d.ok) load(); else setMsg(`Error: ${d.error}`);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Countries ({countries.length})</h1>
          <p className="text-[12.5px] mt-1" style={{ color: 'rgba(var(--text) / 0.35)' }}>
            Pages served at /{'{slug}'} — e.g. /india (hub of states) or /usa (standalone full page). Content, keywords and SEO are fully editable per country.
          </p>
        </div>
        <Link href="/admin/countries/new" className="btn btn-primary"><Plus className="w-4 h-4" /> New Country</Link>
      </div>

      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</div>}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(var(--text) / 0.3)' }} />
          <input className="form-control pl-8 w-full" placeholder="Search by name or slug…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All page types</option>
          <option value="standalone">Standalone</option>
          <option value="hub">Hub</option>
        </select>
        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="card-base overflow-hidden kpi-enter" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <tr>
              <th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Page Type</th>
              <th className="p-3">Status</th><th className="p-3">Updated</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id} className="transition-colors duration-150 hover:bg-surface/[0.025]" style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: 'rgb(var(--text))' }}>{c.name}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(var(--text) / 0.4)' }}>/{c.slug}</td>
                <td className="p-3 capitalize" style={{ color: 'rgba(var(--text) / 0.5)' }}>{c.pageType}</td>
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
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.4)' }}>{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : '—'}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  {c.status === 'published' && (
                    <Link href={`/${c.slug}`} target="_blank" aria-label="View live" className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><ExternalLink className="w-4 h-4" /></Link>
                  )}
                  <Link href={`/admin/countries/${c._id}/edit`} aria-label="Edit" className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><Edit3 className="w-4 h-4" /></Link>
                  <button onClick={() => del(c._id)} aria-label="Delete" className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {loadError && <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</td></tr>}
            {!loadError && filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>
                <Globe2 className="w-5 h-5 mx-auto mb-2 opacity-40" />
                {countries.length === 0 ? 'No countries yet — create your first one.' : 'No countries match these filters.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
