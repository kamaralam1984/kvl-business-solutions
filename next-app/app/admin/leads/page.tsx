'use client';
import { useEffect, useState } from 'react';
import { Search, Trash2, MessageSquare, X, TrendingUp, Users, PhoneCall, Trophy, Brain, Zap, ChevronDown, ChevronUp, Bot, Phone, PhoneMissed, PhoneOff, Loader2 } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';

const STATUS_OPTS = ['new', 'contacted', 'qualified', 'won', 'lost'];
const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-amber-500/10 text-amber-400',
  qualified: 'bg-emerald-500/10 text-emerald-400',
  won: 'bg-emerald-500/10 text-emerald-400',
  lost: 'bg-red-500/10 text-red-400',
};
const INTENT_CONFIG: Record<string, { label: string; cls: string }> = {
  hot:     { label: '🔥 HOT',  cls: 'bg-red-500/20 text-red-500' },
  warm:    { label: '⚡ WARM', cls: 'bg-orange-500/20 text-orange-500' },
  cold:    { label: '❄ COLD',  cls: 'bg-blue-400/20 text-blue-400' },
  unknown: { label: '? N/A',   cls: 'bg-slate-500/20 text-slate-500' },
};

function ScoreBadge({ score, source }: { score: number; source?: string }) {
  const color = score >= 75 ? 'text-red-500 bg-red-500/10' : score >= 40 ? 'text-orange-500 bg-orange-500/10' : 'text-blue-400 bg-blue-400/10';
  const isFallback = source === 'fallback';
  return (
    <div
      className={`relative w-10 h-10 rounded-full grid place-items-center font-extrabold text-sm ${color} shrink-0`}
      style={isFallback ? { border: '1px dashed currentColor' } : undefined}
      title={isFallback ? 'AI scoring unavailable — this is a rule-based estimate, not a real AI judgment' : 'Scored by AI'}
    >
      {score || '?'}
      {isFallback && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-500 text-white text-[8px] grid place-items-center font-bold">~</span>
      )}
    </div>
  );
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async (search = q, status = statusFilter, intent = intentFilter) => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (status) p.set('status', status);
    if (intent) p.set('intent', intent);
    const d = await fetch(`/api/admin/leads?${p}`).then(r => r.json());
    if (d.ok) { setLeads(d.leads); setStats(d.stats); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete lead "${name}"?`)) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    load();
  };

  const rescore = async (lead: any) => {
    await fetch(`/api/admin/leads/${lead._id}/rescore`, { method: 'POST' });
    setTimeout(() => load(), 3000);
  };

  const [calling, setCalling] = useState<string | null>(null);
  const callLead = async (lead: any) => {
    if (!confirm(`"${lead.name}" ko AI call karein? (${lead.phone})`)) return;
    setCalling(lead._id);
    try {
      const r = await fetch(`/api/admin/leads/${lead._id}/call`, { method: 'POST' }).then(x => x.json());
      if (!r.ok) alert(`Call failed: ${r.error}`);
      else { alert('Call shuru ho gayi! Priya ab customer se baat kar rahi hai.'); load(); }
    } finally {
      setCalling(null);
    }
  };

  const statCards = [
    { label: 'Total Leads', value: stats.total || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '🔥 Hot Leads', value: stats.hot || 0, icon: Zap, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'In Progress', value: stats.contacted || 0, icon: PhoneCall, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Won', value: stats.won || 0, icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const hotLeads = leads.filter(l => l.intent === 'hot' && l.status === 'new');

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <p className="eyebrow mb-2">SALES</p>
        <h1 className="text-2xl font-extrabold text-text">Leads</h1>
      </div>

      {/* Hot leads alert */}
      {hotLeads.length > 0 && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <Zap className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm font-semibold text-red-400">
            {hotLeads.length} Hot lead{hotLeads.length > 1 ? 's' : ''} need immediate attention!
            {hotLeads[0]?.aiInsights?.nextAction && ` → ${hotLeads[0].aiInsights.nextAction}`}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="p-4 flex items-center gap-3" style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.07)', borderRadius: '12px' }}>
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div><div className="text-2xl font-extrabold text-text">{s.value}</div><div className="text-xs text-text2">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {['', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); load(q, s, intentFilter); }}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                background: statusFilter === s ? 'rgba(200,169,110,0.12)' : 'rgba(var(--surface) / 0.04)',
                border: `1px solid ${statusFilter === s ? 'rgba(200,169,110,0.35)' : 'rgba(var(--border) / 0.08)'}`,
                color: statusFilter === s ? '#c8a96e' : '#888',
              }}>
              {s ? s.toUpperCase() : `ALL (${stats.total || 0})`}
            </button>
          ))}
          <span className="w-px h-5 mx-1 self-center" style={{ background: 'rgba(var(--border) / 0.08)' }} />
          {['', 'hot', 'warm', 'cold'].map(i => (
            <button key={i} onClick={() => { setIntentFilter(i); load(q, statusFilter, i); }}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                background: intentFilter === i ? 'rgba(200,169,110,0.12)' : 'rgba(var(--surface) / 0.04)',
                border: `1px solid ${intentFilter === i ? 'rgba(200,169,110,0.35)' : 'rgba(var(--border) / 0.08)'}`,
                color: intentFilter === i ? '#c8a96e' : '#888',
              }}>
              {i ? INTENT_CONFIG[i].label : 'All Intent'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'rgba(148,163,184,0.5)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, phone…"
              className="pl-9 w-64 text-sm rounded-lg px-3 py-2 outline-none transition-all"
              style={{ background: 'rgba(var(--surface) / 0.04)', border: '1px solid rgba(var(--border) / 0.08)', color: 'rgba(var(--text) / 0.85)' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200,169,110,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(var(--border) / 0.08)')} />
          </form>
          <ExportButton type="leads" />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.07)', borderRadius: '12px', overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead style={{ borderBottom: '1px solid rgba(var(--border) / 0.07)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>AI Score</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>Lead</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>Contact</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>Service / Intent</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>Status</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: 'none' }}>
            {leads.map((l: any) => (
              <>
                <tr key={l._id} className="transition-colors" style={{ borderBottom: '1px solid rgba(var(--border) / 0.04)', background: l.intent === 'hot' && l.status === 'new' ? 'rgba(239,68,68,0.04)' : 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = l.intent === 'hot' && l.status === 'new' ? 'rgba(239,68,68,0.07)' : 'rgba(var(--surface) / 0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = l.intent === 'hot' && l.status === 'new' ? 'rgba(239,68,68,0.04)' : 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={l.aiScore} source={l.aiScoreSource} />
                      {l.intent && l.intent !== 'unknown' && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${INTENT_CONFIG[l.intent]?.cls}`}>
                          {INTENT_CONFIG[l.intent]?.label}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="font-semibold text-text">{l.name}</div>
                      {l.source === 'chatbot' && <Bot className="w-3.5 h-3.5 text-primary" aria-label="Auto-captured from chatbot" />}
                    </div>
                    <div className="text-xs text-text2">{l.source || 'contact-form'}</div>
                    {l.aiInsights?.summary && <div className="text-[11px] text-text2 mt-0.5 italic">{l.aiInsights.summary}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div style={{ color: 'rgba(var(--text) / 0.8)' }}>{l.email?.startsWith('chat_') ? '—' : l.email}</div>
                    <div className="text-text2">{l.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-medium" style={{ color: 'rgba(var(--text) / 0.8)' }}>{l.service || '—'}</div>
                    {l.aiInsights?.nextAction && (
                      <div className="text-[10px] text-primary mt-0.5">→ {l.aiInsights.nextAction}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select value={l.status || 'new'} onChange={e => updateStatus(l._id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLOR[l.status || 'new']}`}>
                      {STATUS_OPTS.map(s => <option key={s} value={s} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.toUpperCase()}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* AI Call button */}
                      {l.callStatus === 'calling' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                          <Loader2 className="w-3 h-3 animate-spin" />Calling…
                        </span>
                      ) : l.callStatus === 'completed' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <Phone className="w-3 h-3" />{l.callDuration ? `${Math.round(l.callDuration)}s` : 'Done'}
                        </span>
                      ) : l.callStatus === 'no_answer' ? (
                        <button onClick={() => callLead(l)} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-1 rounded-full hover:bg-orange-500/10 hover:text-orange-400">
                          <PhoneMissed className="w-3 h-3" />Retry
                        </button>
                      ) : (
                        <button onClick={() => callLead(l)} disabled={calling === l._id}
                          className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 disabled:opacity-50">
                          <Phone className="w-3 h-3" />AI Call
                        </button>
                      )}
                      <button onClick={() => setExpanded(expanded === l._id ? null : l._id)}
                        className="p-1 text-text2 hover:text-primary" aria-label="AI Insights">
                        <Brain className="w-4 h-4" />
                      </button>
                      {l.message && (
                        <button onClick={() => setPreview(l)} className="p-1 text-text2 hover:text-primary" aria-label="View message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => del(l._id, l.name)} className="p-1 text-text2 hover:text-red-500" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expanded === l._id ? <ChevronUp className="w-3 h-3 text-text2" /> : <ChevronDown className="w-3 h-3 text-text2" />}
                    </div>
                  </td>
                </tr>
                {/* AI Insights Expanded Row */}
                {expanded === l._id && (
                  <tr key={`${l._id}-exp`} style={{ borderBottom: '1px solid rgba(var(--border) / 0.04)', background: 'rgba(200,169,110,0.04)' }}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="grid sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-text2 uppercase tracking-wider text-[10px]">AI Insights</p>
                          <p><span className="text-text2">Budget:</span> <span className="font-semibold">{l.aiInsights?.budget || 'Not mentioned'}</span></p>
                          <p><span className="text-text2">Timeline:</span> <span className="font-semibold">{l.aiInsights?.timeline || 'Not mentioned'}</span></p>
                          <p><span className="text-text2">Company:</span> <span className="font-semibold">{l.aiInsights?.companyType || 'Unknown'}</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-text2 uppercase tracking-wider text-[10px]">Urgency & Action</p>
                          <p><span className="text-text2">Urgency:</span> <span className="font-semibold">{l.aiInsights?.urgency || '—'}</span></p>
                          <p><span className="text-text2">Next Action:</span> <span className="font-semibold text-primary">{l.aiInsights?.nextAction || '—'}</span></p>
                          <p><span className="text-text2">Scored:</span> <span className="font-semibold">{l.aiScoredAt ? new Date(l.aiScoredAt).toLocaleString('en-IN') : 'Pending...'}</span></p>
                          {l.aiScoreSource === 'fallback' && (
                            <p className="text-amber-500 font-semibold">⚠ Rule-based estimate — AI providers were unavailable when this lead was scored, not a real AI judgment.</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-text2 uppercase tracking-wider text-[10px]">Lead Info</p>
                          <p><span className="text-text2">Source:</span> <span className="font-semibold">{l.source}</span></p>
                          <p><span className="text-text2">Created:</span> <span className="font-semibold">{new Date(l.createdAt).toLocaleString('en-IN')}</span></p>
                          {l.chatMessages?.length > 0 && <p><span className="text-text2">Chat turns:</span> <span className="font-semibold">{l.chatMessages.length}</span></p>}
                          {l.calledAt && <p><span className="text-text2">AI Called:</span> <span className="font-semibold">{new Date(l.calledAt).toLocaleString('en-IN')}</span></p>}
                          {l.callRecordingUrl && <a href={l.callRecordingUrl} target="_blank" rel="noreferrer" className="text-primary underline text-[10px]">🎙 Recording sunein</a>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center">
                <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: '#888' }} />
                <p className="font-medium" style={{ color: 'rgba(148,163,184,0.6)' }}>No leads found</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>Leads from contact form and chatbot will appear here with AI scores</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Message Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md p-6" style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: '16px' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-text">{preview.name}</h3>
                <p className="text-xs text-text2">{preview.email} · {preview.phone}</p>
              </div>
              <button onClick={() => setPreview(null)} style={{ color: 'rgba(148,163,184,0.6)' }}><X className="w-5 h-5" /></button>
            </div>
            {preview.chatMessages?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {preview.chatMessages.map((m: any, i: number) => (
                  <div key={i} className={`text-xs p-2 rounded-lg ${m.role === 'user' ? 'ml-4' : 'mr-4'}`}
                    style={{ background: m.role === 'user' ? 'rgba(200,169,110,0.1)' : 'rgba(var(--surface) / 0.05)', color: m.role === 'user' ? '#c8a96e' : 'rgba(var(--text) / 0.7)' }}>
                    <span className="font-bold">{m.role === 'user' ? 'Customer' : 'AI'}: </span>{m.content}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 text-sm whitespace-pre-wrap" style={{ background: 'rgba(var(--surface) / 0.04)', color: 'rgba(148,163,184,0.8)' }}>{preview.message}</div>
            )}
            {preview.service && <p className="mt-3 text-xs text-text2">Service: <span className="font-semibold text-text">{preview.service}</span></p>}
          </div>
        </div>
      )}
    </div>
  );
}
