'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type Reply = { message: string; authorEmail?: string; isAdmin: boolean; createdAt: string };
type Ticket = {
  _id: string; name: string; email: string; product?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string; status: 'open' | 'in-progress' | 'resolved' | 'closed';
  replies: Reply[]; createdAt: string;
};

const priorityColor: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-yellow-500/20 text-yellow-500',
  high: 'bg-orange-500/20 text-orange-500',
  critical: 'bg-red-500/20 text-red-500',
};

const statusColor: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-400',
  'in-progress': 'bg-amber-500/20 text-amber-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-slate-500/20 text-slate-400',
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => fetch('/api/admin/tickets').then(r => r.json()).then(d => { if (d.ok) setTickets(d.tickets); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Ticket['status']) => {
    await fetch(`/api/admin/tickets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const sendReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const r = await fetch(`/api/admin/tickets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reply: replyText, status: 'in-progress' }) });
      const d = await r.json();
      if (d.ok) { setReplyText(''); load(); }
      else alert(d.error || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Tickets ({tickets.length})</h1>
        <ExportButton type="tickets" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <AdminSkeleton rows={2} />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No tickets yet.</p>
      ) : (
        <div className="space-y-2 stagger-children">
          {tickets.map(t => {
            const isOpen = expanded === t._id;
            return (
              <div key={t._id} className="admin-card-hover kpi-enter rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
                <button onClick={() => setExpanded(isOpen ? null : t._id)} className="w-full flex items-center justify-between gap-3 p-4 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: 'rgb(var(--text))' }}>{t.name}</span>
                      <span className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.35)' }}>{t.email}</span>
                    </div>
                    <div className="text-[12.5px] truncate" style={{ color: 'rgba(var(--text) / 0.5)' }}>{t.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[t.priority]}`}>{t.priority.toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>{t.status.toUpperCase()}</span>
                    {t.replies?.length > 0 && (
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(var(--text) / 0.35)' }}>{t.replies.length} reply</span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(var(--text) / 0.3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(var(--text) / 0.3)' }} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(var(--border) / 0.05)' }}>
                    <div className="pt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.35)' }}>Status:</span>
                      {(['open', 'in-progress', 'resolved', 'closed'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(t._id, s)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${t.status === s ? statusColor[s] : 'opacity-40 hover:opacity-70'}`}
                          style={t.status !== s ? { background: 'rgba(var(--surface) / 0.05)', color: 'rgba(var(--text) / 0.5)' } : {}}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {t.replies?.map((r, i) => (
                      <div key={i} className="p-3 rounded-lg text-[12.5px]" style={{ background: r.isAdmin ? 'rgba(200,169,110,0.08)' : 'rgba(var(--surface) / 0.03)', color: 'rgba(var(--text) / 0.75)' }}>
                        <div className="text-[10.5px] font-semibold mb-1" style={{ color: r.isAdmin ? '#c8a96e' : 'rgba(var(--text) / 0.4)' }}>
                          {r.isAdmin ? 'You (admin)' : t.name} · {new Date(r.createdAt).toLocaleString('en-IN')}
                        </div>
                        {r.message}
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        className="form-control flex-1 text-sm"
                        placeholder="Type a reply — this emails the customer"
                        value={expanded === t._id ? replyText : ''}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendReply(t._id)}
                      />
                      <button onClick={() => sendReply(t._id)} disabled={sending} className="btn btn-primary text-sm px-4">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
