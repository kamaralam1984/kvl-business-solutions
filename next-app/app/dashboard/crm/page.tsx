'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Save, Sparkles, IndianRupee, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const STAGES = [
  { id: 'lead', label: 'Lead', color: '#94a3b8' },
  { id: 'qualified', label: 'Qualified', color: '#3b82f6' },
  { id: 'proposal', label: 'Proposal', color: '#f97316' },
  { id: 'negotiation', label: 'Negotiation', color: '#eab308' },
  { id: 'won', label: 'Won 🎉', color: '#22c55e' },
  { id: 'lost', label: 'Lost', color: '#ef4444' },
];

type Deal = {
  _id?: string;
  title: string; contactName?: string; value: number;
  stage: string; probability: number;
  source?: string; notes?: string; aiSuggestion?: string;
};

const empty: Deal = { title: '', contactName: '', value: 0, stage: 'lead', probability: 20, source: '', notes: '' };

export default function CrmPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const load = () => fetch('/api/crm/deals').then(r => r.json()).then(d => d.ok && setDeals(d.deals));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/crm/deals' : `/api/crm/deals/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const d = await r.json();
    if (d.ok) { setEditing(null); load(); }
  };

  const moveStage = async (d: Deal, stage: string) => {
    await fetch(`/api/crm/deals/${d._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) });
    load();
  };

  const del = async (d: Deal) => {
    if (!confirm(`Delete deal "${d.title}"?`)) return;
    await fetch(`/api/crm/deals/${d._id}`, { method: 'DELETE' });
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

  const totalValue = deals.filter(d => d.stage !== 'lost').reduce((s, d) => s + d.value, 0);
  const wonValue = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Briefcase className="w-7 h-7 text-primary" /> AI CRM</h1>
          <p className="text-text2 text-sm mt-1">Track deals from lead to close. AI suggests the best next action.</p>
        </div>
        <div className="flex gap-3 items-end">
          <div className="text-right"><div className="text-xs text-text2">Pipeline</div><div className="text-2xl font-extrabold text-primary">{formatINR(totalValue)}</div></div>
          <div className="text-right"><div className="text-xs text-text2">Won</div><div className="text-2xl font-extrabold text-green-500">{formatINR(wonValue)}</div></div>
          <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Deal</button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {STAGES.map(s => {
          const stageDeals = deals.filter(d => d.stage === s.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={s.id} className="card-base p-3 min-h-[400px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-tint">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </h3>
                <span className="text-[10px] text-text2 font-bold">{stageDeals.length}</span>
              </div>
              <div className="text-[10px] text-text2 mb-3">{formatINR(stageValue)}</div>

              <div className="space-y-2">
                {stageDeals.map(d => (
                  <div key={d._id} className="surface-tint p-3 rounded-lg cursor-pointer hover:bg-primary/10 group">
                    <div className="font-semibold text-sm mb-1">{d.title}</div>
                    {d.contactName && <div className="text-[10px] text-text2 mb-1">{d.contactName}</div>}
                    <div className="text-xs font-bold text-primary">{formatINR(d.value)}</div>
                    <div className="text-[10px] text-text2 mt-1">{d.probability}% chance</div>

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
                ))}

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
              <input className="form-control" placeholder="Contact name" value={editing.contactName || ''} onChange={e => setEditing({ ...editing, contactName: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" type="number" placeholder="Value ₹" value={editing.value || ''} onChange={e => setEditing({ ...editing, value: parseInt(e.target.value) || 0 })} />
                <input className="form-control" type="number" placeholder="% chance" value={editing.probability} onChange={e => setEditing({ ...editing, probability: parseInt(e.target.value) || 0 })} />
              </div>
              <select className="form-control" value={editing.stage} onChange={e => setEditing({ ...editing, stage: e.target.value })}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <input className="form-control" placeholder="Source (e.g., website, referral)" value={editing.source || ''} onChange={e => setEditing({ ...editing, source: e.target.value })} />
              <textarea className="form-control" rows={3} placeholder="Notes" value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} />
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
