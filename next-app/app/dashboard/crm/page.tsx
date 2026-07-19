'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, X, Save, Sparkles, Briefcase, Loader2, Search, Download, CheckSquare, Square, Filter, Star } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toCSV } from '@/lib/csv';

const STAGES = [
  { id: 'lead', label: 'Lead', color: '#94a3b8' },
  { id: 'qualified', label: 'Qualified', color: '#3b82f6' },
  { id: 'proposal', label: 'Proposal', color: '#f97316' },
  { id: 'negotiation', label: 'Negotiation', color: '#eab308' },
  { id: 'won', label: 'Won 🎉', color: '#22c55e' },
  { id: 'repeat', label: 'Repeat Business', color: '#8b5cf6' },
  { id: 'lost', label: 'Lost', color: '#ef4444' },
];

type Deal = {
  _id?: string;
  title: string; contactName?: string; contactEmail?: string; value: number;
  stage: string; probability: number;
  source?: string; notes?: string; aiSuggestion?: string;
  tags?: string[]; ownerEmail?: string; createdAt?: string; updatedAt?: string;
  reviewRequestedAt?: string;
};

const empty: Deal = { title: '', contactName: '', contactEmail: '', value: 0, stage: 'lead', probability: 20, source: '', notes: '', tags: [] };

export default function CrmPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // --- Search / filters (task 6) ---
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // --- Bulk select (task 6) ---
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStage, setBulkStage] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);

  // --- Drag-and-drop kanban ---
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const load = () => fetch('/api/crm/deals').then(r => r.json()).then(d => d.ok && setDeals(d.deals));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/crm/deals' : `/api/crm/deals/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); }
    else alert(d.error || 'Failed to save deal');
  };

  const moveStage = async (d: Deal, stage: string) => {
    if (d.stage === stage) return;
    // Optimistic update — the card jumps to the new column immediately instead
    // of waiting for the round-trip, which is what makes drag-and-drop feel
    // real. Reverted if the request actually fails.
    const prevDeals = deals;
    setDeals(ds => ds.map(x => (x._id === d._id ? { ...x, stage } : x)));
    const r = await fetch(`/api/crm/deals/${d._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) });
    const res = await r.json();
    if (!res.ok) { setDeals(prevDeals); alert(res.error || 'Failed to move deal'); }
    else load();
  };

  const del = async (d: Deal) => {
    if (!confirm(`Delete deal "${d.title}"?`)) return;
    const r = await fetch(`/api/crm/deals/${d._id}`, { method: 'DELETE' });
    const res = await r.json();
    if (!res.ok) alert(res.error || 'Failed to delete deal');
    load();
  };

  const askAI = async (d: Deal) => {
    setAiLoading(d._id!);
    try {
      const r = await fetch(`/api/crm/deals/${d._id}`, { method: 'POST' });
      const data = await r.json();
      if (data.ok) load();
    } finally { setAiLoading(null); }
  };

  const requestReview = async (d: Deal) => {
    const r = await fetch(`/api/crm/deals/${d._id}/request-review`, { method: 'POST' });
    const data = await r.json();
    if (!data.ok) { alert(data.error || 'Could not send review request'); return; }
    alert(`Review request sent to ${d.contactEmail}`);
    load();
  };

  // Distinct facet values, derived from the loaded deals
  const allTags = useMemo(() => Array.from(new Set(deals.flatMap(d => d.tags || []))).sort(), [deals]);
  const allOwners = useMemo(() => Array.from(new Set(deals.map(d => d.ownerEmail).filter(Boolean) as string[])).sort(), [deals]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;
    return deals.filter(d => {
      if (s && !(d.title.toLowerCase().includes(s) || (d.contactName || '').toLowerCase().includes(s))) return false;
      if (stageFilter && d.stage !== stageFilter) return false;
      if (ownerFilter && !(d.ownerEmail || '').toLowerCase().includes(ownerFilter.toLowerCase())) return false;
      if (sourceFilter && !(d.source || '').toLowerCase().includes(sourceFilter.toLowerCase())) return false;
      if (tagFilter && !(d.tags || []).includes(tagFilter)) return false;
      if (from && d.createdAt && new Date(d.createdAt) < from) return false;
      if (to && d.createdAt && new Date(d.createdAt) > to) return false;
      return true;
    });
  }, [deals, search, stageFilter, ownerFilter, sourceFilter, tagFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearch(''); setStageFilter(''); setOwnerFilter(''); setSourceFilter(''); setTagFilter(''); setDateFrom(''); setDateTo('');
  };
  const hasFilters = !!(search || stageFilter || ownerFilter || sourceFilter || tagFilter || dateFrom || dateTo);

  const toggleQuickStage = (stage: string) => setStageFilter(prev => prev === stage ? '' : stage);

  const totalValue = filtered.filter(d => d.stage !== 'lost').reduce((s, d) => s + d.value, 0);
  const wonValue = filtered.filter(d => d.stage === 'won' || d.stage === 'repeat').reduce((s, d) => s + d.value, 0);

  const exportCSV = () => {
    const rows = filtered.map(d => ({
      title: d.title,
      contactName: d.contactName || '',
      value: d.value,
      stage: d.stage,
      probability: d.probability,
      source: d.source || '',
      owner: d.ownerEmail || '',
      tags: (d.tags || []).join(';'),
      notes: d.notes || '',
      createdAt: d.createdAt || '',
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kvl-deals-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // --- Bulk actions ---
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const applyBulkStage = async () => {
    if (!bulkStage || selectedIds.size === 0) return;
    setBulkBusy(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id =>
        fetch(`/api/crm/deals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: bulkStage }) })
      ));
      setSelectedIds(new Set()); setBulkStage('');
      load();
    } finally { setBulkBusy(false); }
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected deal(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/crm/deals/${id}`, { method: 'DELETE' })));
      setSelectedIds(new Set());
      load();
    } finally { setBulkBusy(false); }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Briefcase className="w-7 h-7 text-primary" /> AI CRM</h1>
          <p className="text-text2 text-sm mt-1">Track deals from lead to close. AI suggests the best next action.</p>
        </div>
        <div className="flex gap-3 items-end">
          <div className="text-right"><div className="text-xs text-text2">Pipeline{hasFilters ? ' (filtered)' : ''}</div><div className="text-2xl font-extrabold text-primary">{formatINR(totalValue)}</div></div>
          <div className="text-right"><div className="text-xs text-text2">Won</div><div className="text-2xl font-extrabold text-green-500">{formatINR(wonValue)}</div></div>
          <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Deal</button>
        </div>
      </div>

      {/* Search + filters toolbar */}
      <div className="card-base p-3 mb-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text2" />
          <input className="form-control w-full pl-9" placeholder="Search title or contact name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control w-auto" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>All stages</option>
          {STAGES.map(s => <option key={s.id} value={s.id} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.label}</option>)}
        </select>
        <input className="form-control w-auto" placeholder="Owner email" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} list="crm-owners" />
        <datalist id="crm-owners">{allOwners.map(o => <option key={o} value={o} />)}</datalist>
        <input className="form-control w-auto" placeholder="Source" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} />
        {allTags.length > 0 && (
          <select className="form-control w-auto" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
            <option value="" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>All tags</option>
            {allTags.map(t => <option key={t} value={t} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{t}</option>)}
          </select>
        )}
        <input type="date" className="form-control w-auto" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
        <input type="date" className="form-control w-auto" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
        {hasFilters && <button onClick={clearFilters} className="btn btn-ghost text-xs"><X className="w-3.5 h-3.5" /> Clear</button>}
      </div>

      {/* Quick filters + export + bulk-select toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[11px] text-text2 font-bold flex items-center gap-1"><Filter className="w-3 h-3" /> Quick:</span>
        {(['won', 'lost', 'repeat'] as const).map(stg => {
          const s = STAGES.find(x => x.id === stg)!;
          const active = stageFilter === stg;
          return (
            <button key={stg} onClick={() => toggleQuickStage(stg)}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors"
              style={{ background: active ? s.color : 'transparent', color: active ? '#fff' : s.color, border: `1px solid ${s.color}` }}>
              {s.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <button onClick={exportCSV} className="btn btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Export CSV</button>
        <button onClick={() => { setSelectMode(v => !v); setSelectedIds(new Set()); }} className="btn btn-ghost text-xs">
          {selectMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />} {selectMode ? 'Exit select' : 'Select deals'}
        </button>
      </div>
      <p className="text-[10.5px] text-text2 mb-4">💡 Drag any card into a different column to change its stage.</p>

      {/* Bulk action bar */}
      {selectMode && (
        <div className="card-base p-3 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold">{selectedIds.size} selected</span>
          <select className="form-control w-auto" value={bulkStage} onChange={e => setBulkStage(e.target.value)} disabled={selectedIds.size === 0}>
            <option value="" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Change stage to…</option>
            {STAGES.map(s => <option key={s.id} value={s.id} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.label}</option>)}
          </select>
          <button onClick={applyBulkStage} disabled={!bulkStage || selectedIds.size === 0 || bulkBusy} className="btn btn-primary text-xs disabled:opacity-50">
            {bulkBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Apply
          </button>
          <button onClick={bulkDelete} disabled={selectedIds.size === 0 || bulkBusy} className="btn btn-ghost text-xs text-red-500 disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" /> Delete selected
          </button>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto">
        {STAGES.map(s => {
          const stageDeals = filtered.filter(d => d.stage === s.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const isDragOver = dragOverStage === s.id;
          return (
            <div
              key={s.id}
              className="card-base p-3 min-h-[400px] transition-all duration-150"
              style={isDragOver ? { outline: `2px dashed ${s.color}`, outlineOffset: 2, background: `${s.color}0d` } : undefined}
              onDragOver={e => { e.preventDefault(); setDragOverStage(s.id); }}
              onDragLeave={() => setDragOverStage(prev => (prev === s.id ? null : prev))}
              onDrop={e => {
                e.preventDefault();
                setDragOverStage(null);
                const deal = deals.find(x => x._id === draggingId);
                if (deal) moveStage(deal, s.id);
                setDraggingId(null);
              }}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-tint">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </h3>
                <span className="text-[10px] text-text2 font-bold">{stageDeals.length}</span>
              </div>
              <div className="text-[10px] text-text2 mb-3">{formatINR(stageValue)}</div>

              <div className="space-y-2">
                {stageDeals.map(d => {
                  const daysInStage = d.updatedAt ? Math.floor((Date.now() - new Date(d.updatedAt).getTime()) / 86_400_000) : 0;
                  const isStale = daysInStage >= 7 && !['won', 'lost', 'repeat'].includes(d.stage);
                  return (
                  <div
                    key={d._id}
                    draggable={!selectMode}
                    onDragStart={() => setDraggingId(d._id!)}
                    onDragEnd={() => setDraggingId(null)}
                    className={`surface-tint p-3 rounded-lg group ${selectMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'} hover:bg-primary/10 transition-opacity ${draggingId === d._id ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {selectMode && (
                        <input type="checkbox" className="mt-1 shrink-0" checked={selectedIds.has(d._id!)} onChange={() => toggleSelect(d._id!)} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="font-semibold text-sm flex-1 min-w-0">{d.title}</div>
                          {isStale && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 shrink-0" title={`No stage change in ${daysInStage} days`}>
                              ⏳ {daysInStage}d
                            </span>
                          )}
                        </div>
                        {d.contactName && <div className="text-[10px] text-text2 mb-1">{d.contactName}</div>}
                        <div className="text-xs font-bold text-primary">{formatINR(d.value)}</div>
                        <div className="text-[10px] text-text2 mt-1">{d.probability}% chance</div>
                      </div>
                    </div>

                    {d.tags && d.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {d.tags.map(t => (
                          <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                        ))}
                      </div>
                    )}

                    {d.aiSuggestion && (
                      <div className="mt-2 p-2 rounded bg-primary/10 text-[10px] text-text2 leading-relaxed">
                        <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
                        {d.aiSuggestion}
                      </div>
                    )}

                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => askAI(d)} disabled={aiLoading === d._id} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                        {aiLoading === d._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI tip
                      </button>
                      <button onClick={() => { setEditing(d); setIsNew(false); }} className="text-[10px] text-text2 hover:text-primary">Edit</button>
                      <button onClick={() => del(d)} className="text-[10px] text-text2 hover:text-red-500">Del</button>
                      {(d.stage === 'won' || d.stage === 'repeat') && (
                        <button
                          onClick={() => requestReview(d)}
                          disabled={!d.contactEmail}
                          title={d.contactEmail ? (d.reviewRequestedAt ? `Already sent ${new Date(d.reviewRequestedAt).toLocaleDateString('en-IN')} — click to resend` : 'Email the client asking for a testimonial') : 'Add a contact email first (Edit)'}
                          className="text-[10px] text-text2 hover:text-primary disabled:opacity-40 disabled:hover:text-text2 flex items-center gap-0.5"
                        >
                          <Star className="w-3 h-3" /> {d.reviewRequestedAt ? 'Resend review req.' : 'Request review'}
                        </button>
                      )}
                    </div>

                    {/* Move to next/prev stage */}
                    <div className="flex gap-1 mt-1">
                      {STAGES.filter(st => st.id !== s.id).slice(0, 2).map(target => (
                        <button key={target.id} onClick={() => moveStage(d, target.id)} className="text-[9px] px-1.5 py-0.5 rounded surface2-tint hover:bg-primary hover:text-white">
                          →{target.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  );
                })}

                {stageDeals.length === 0 && <div className="text-[10px] text-text2 text-center py-4">No deals</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'New Deal' : 'Edit Deal'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control" placeholder="Deal title *" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Contact name" value={editing.contactName || ''} onChange={e => setEditing({ ...editing, contactName: e.target.value })} />
                <input className="form-control" type="email" placeholder="Contact email" value={editing.contactEmail || ''} onChange={e => setEditing({ ...editing, contactEmail: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" type="number" placeholder="Value ₹" value={editing.value || ''} onChange={e => setEditing({ ...editing, value: parseInt(e.target.value) || 0 })} />
                <input className="form-control" type="number" placeholder="% chance" value={editing.probability} onChange={e => setEditing({ ...editing, probability: parseInt(e.target.value) || 0 })} />
              </div>
              <select className="form-control" value={editing.stage} onChange={e => setEditing({ ...editing, stage: e.target.value })}>
                {STAGES.map(s => <option key={s.id} value={s.id} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.label}</option>)}
              </select>
              <input className="form-control" placeholder="Source (e.g., website, referral)" value={editing.source || ''} onChange={e => setEditing({ ...editing, source: e.target.value })} />
              <input className="form-control" placeholder="Tags (comma separated, e.g. vip, renewal)" value={(editing.tags || []).join(', ')}
                onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              <textarea className="form-control" rows={3} placeholder="Notes" value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} />
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
