'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type Msg = { role: 'user' | 'assistant'; content: string };
type LogEntry = { _id: string; sessionId: string; messages: Msg[]; leadCaptured: boolean; lastMessageAt: string; createdAt: string };

export default function ChatbotLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [leadCapturedCount, setLeadCapturedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    fetch('/api/admin/chatbot-logs')
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setLogs(d.logs); setTotal(d.total); setLeadCapturedCount(d.leadCapturedCount); }
        else setLoadError(true);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
            Chatbot Conversations
          </h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Every conversation with Khushi (the AI assistant) — including ones that never converted to a lead.
          </p>
        </div>
        {!loading && (
          <div className="text-right shrink-0">
            <div className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{total}</div>
            <div className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.35)' }}>{leadCapturedCount} led to a captured lead</div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <AdminSkeleton rows={2} />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <p className="text-[13px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>Failed to load — check your connection and try refreshing.</p>
      ) : logs.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>No conversations yet.</p>
      ) : (
        <div className="space-y-2 stagger-children">
          {logs.map(log => {
            const isOpen = expanded === log._id;
            const firstUserMsg = log.messages.find(m => m.role === 'user')?.content || '(no reply from visitor)';
            return (
              <div key={log._id} className="admin-card-hover kpi-enter rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : log._id)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-4 h-4 shrink-0" style={{ color: '#c8a96e' }} />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium truncate" style={{ color: 'rgba(var(--text) / 0.75)' }}>{firstUserMsg}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'rgba(var(--text) / 0.3)' }}>
                        {log.messages.length} messages · {new Date(log.lastMessageAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {log.leadCaptured && (
                      <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                        <CheckCircle2 className="w-3 h-3" /> Lead
                      </span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(var(--text) / 0.3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(var(--text) / 0.3)' }} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(var(--border) / 0.05)' }}>
                    {log.messages.map((m, i) => (
                      <div
                        key={i}
                        className="max-w-[85%] px-3 py-2 rounded-xl text-[12.5px] leading-relaxed mt-2"
                        style={{
                          marginLeft: m.role === 'user' ? 'auto' : 0,
                          background: m.role === 'user' ? 'rgba(200,169,110,0.12)' : 'rgba(var(--surface) / 0.04)',
                          color: 'rgba(var(--text) / 0.8)',
                        }}
                      >
                        {m.content}
                      </div>
                    ))}
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
