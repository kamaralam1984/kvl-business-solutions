'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit3, Copy, Eye, Search, Globe2, CheckCircle2, CircleDashed } from 'lucide-react';

type Location = {
  _id: string; country: string; regionType: string; name: string; slug: string;
  status: 'draft' | 'published'; updatedAt: string;
};

export default function AdminLocationPagesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [q, setQ] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/location-pages').then(r => r.json())
      .then(d => { if (d.ok) setLocations(d.locations); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const countries = useMemo(() => Array.from(new Set(locations.map(l => l.country))), [locations]);

  const filtered = locations.filter(l => {
    if (countryFilter !== 'all' && l.country !== countryFilter) return false;
    if (typeFilter !== 'all' && l.regionType !== typeFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (q && !l.name.toLowerCase().includes(q.toLowerCase()) && !l.slug.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const del = async (id: string) => {
    if (!confirm('Delete this location page? This cannot be undone.')) return;
    await fetch(`/api/admin/location-pages/${id}`, { method: 'DELETE' });
    load();
  };

  const duplicate = async (id: string) => {
    const r = await fetch(`/api/admin/location-pages/${id}/duplicate`, { method: 'POST' });
    const d = await r.json();
    if (d.ok) { setMsg('✓ Duplicated as draft'); load(); } else setMsg(`Error: ${d.error}`);
  };

  const toggleStatus = async (l: Location) => {
    const status = l.status === 'published' ? 'draft' : 'published';
    const r = await fetch(`/api/admin/location-pages/${l._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    const d = await r.json();
    if (d.ok) load(); else setMsg(`Error: ${d.error}`);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Location Pages ({locations.length})</h1>
          <p className="text-[12.5px] mt-1" style={{ color: 'rgba(var(--text) / 0.35)' }}>
            State &amp; union-territory SEO landing pages, served at /{'{country}'}/{'{slug}'} — e.g. /india/bihar.
          </p>
        </div>
        <Link href="/admin/location-pages/new" className="btn btn-primary"><Plus className="w-4 h-4" /> New Location</Link>
      </div>

      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</div>}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(var(--text) / 0.3)' }} />
          <input className="form-control pl-8 w-full" placeholder="Search by name or slug…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="form-control" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
          <option value="all">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="state">State</option>
          <option value="union_territory">Union Territory</option>
          <option value="region">Region</option>
          <option value="city">City</option>
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
              <th className="p-3">Name</th><th className="p-3">Country</th><th className="p-3">Type</th>
              <th className="p-3">Slug</th><th className="p-3">Status</th><th className="p-3">Updated</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l._id} className="transition-colors duration-150 hover:bg-surface/[0.025]" style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: 'rgb(var(--text))' }}>{l.name}</td>
                <td className="p-3 capitalize" style={{ color: 'rgba(var(--text) / 0.6)' }}>{l.country}</td>
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>{l.regionType === 'union_territory' ? 'Union Territory' : l.regionType}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(var(--text) / 0.4)' }}>/{l.country}/{l.slug}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(l)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={l.status === 'published'
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                      : { background: 'rgba(var(--surface) / 0.06)', color: 'rgba(var(--text) / 0.45)', border: '1px solid rgba(var(--border) / 0.12)' }}
                  >
                    {l.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <CircleDashed className="w-3 h-3" />}
                    {l.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="p-3" style={{ color: 'rgba(var(--text) / 0.4)' }}>{new Date(l.updatedAt).toLocaleDateString()}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/location-pages/${l._id}/preview`} target="_blank" aria-label="Preview" className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><Eye className="w-4 h-4" /></Link>
                  <Link href={`/admin/location-pages/${l._id}/edit`} aria-label="Edit" className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><Edit3 className="w-4 h-4" /></Link>
                  <button onClick={() => duplicate(l._id)} aria-label="Duplicate" className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Copy className="w-4 h-4" /></button>
                  <button onClick={() => del(l._id)} aria-label="Delete" className="p-1" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {loadError && <tr><td colSpan={7} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</td></tr>}
            {!loadError && filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>
                <Globe2 className="w-5 h-5 mx-auto mb-2 opacity-40" />
                {locations.length === 0 ? 'No location pages yet — create your first one.' : 'No location pages match these filters.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
