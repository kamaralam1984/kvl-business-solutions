'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, X, Mail, Linkedin, Send, MessageCircle, CalendarCheck, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';

type Campaign = {
  _id: string; name: string; channel: 'email' | 'linkedin';
  subjectTemplate: string; bodyTemplate: string; status: string;
  autoSend: boolean; dailySendLimit: number;
  statusCounts: Record<string, number>;
};

const empty = { name: '', channel: 'email' as const, subjectTemplate: '', bodyTemplate: '', autoSend: false, dailySendLimit: 15 };

export default function OutreachCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creating, setCreating] = useState<typeof empty | null>(null);
  const [editing, setEditing] = useState<Pick<Campaign, '_id' | 'name' | 'channel' | 'subjectTemplate' | 'bodyTemplate' | 'status' | 'autoSend' | 'dailySendLimit'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/outreach/campaigns').then(r => r.json())
      .then(d => { if (d.ok) setCampaigns(d.campaigns); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!creating) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/outreach/campaigns', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creating),
      });
      const d = await r.json();
      if (d.ok) { setCreating(null); load(); } else alert(d.error || 'Failed');
    } finally { setSaving(false); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/outreach/campaigns/${editing._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name, channel: editing.channel,
          subjectTemplate: editing.subjectTemplate, bodyTemplate: editing.bodyTemplate,
          status: editing.status, autoSend: editing.autoSend, dailySendLimit: editing.dailySendLimit,
        }),
      });
      const d = await r.json();
      if (d.ok) { setEditing(null); load(); } else alert(d.error || 'Failed');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this campaign? Its prospects will be deleted too.')) return;
    const r = await fetch(`/api/admin/outreach/campaigns/${id}`, { method: 'DELETE' });
    const d = await r.json();
    if (d.ok) load(); else alert(d.error || 'Failed');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>Outreach CRM</h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Default: drafts only — generate, review, send yourself. Turn on <b>Auto-send</b> on a campaign to have AI write, send, and negotiate cold emails automatically — that&apos;s real unsolicited email leaving without per-message review, so only point it at lists you&apos;re sure you&apos;re allowed to contact.
          </p>
        </div>
        <button onClick={() => setCreating(empty)} className="btn btn-primary"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {campaigns.map(c => {
          const sc = c.statusCounts || {};
          const total = Object.values(sc).reduce((s, n) => s + n, 0);
          const replied = sc.replied || 0;
          const meetings = sc.meeting_booked || 0;
          return (
            <div key={c._id} className="relative rounded-2xl" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <Link href={`/admin/outreach/${c._id}`} className="block p-5 pr-20 transition-colors hover:bg-[rgba(var(--surface)/0.03)] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {c.channel === 'email' ? <Mail className="w-4 h-4 text-primary" /> : <Linkedin className="w-4 h-4 text-primary" />}
                    <h3 className="font-bold" style={{ color: 'rgb(var(--text))' }}>{c.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {c.autoSend && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }} title="AI sends, replies, and negotiates automatically">
                        AUTO
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(var(--surface) / 0.08)', color: c.status === 'active' ? '#4ade80' : 'rgba(var(--text) / 0.5)' }}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[12px] mt-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                  <span>{total} prospects</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {replied} replied</span>
                  <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {meetings} meetings</span>
                </div>
              </Link>
              <div className="absolute top-5 right-5 flex items-center gap-3">
                <button
                  onClick={() => setEditing({ _id: c._id, name: c.name, channel: c.channel, subjectTemplate: c.subjectTemplate, bodyTemplate: c.bodyTemplate, status: c.status, autoSend: c.autoSend, dailySendLimit: c.dailySendLimit })}
                  aria-label="Edit campaign"
                  style={{ color: 'rgba(var(--text) / 0.35)' }}
                  className="hover:text-primary transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => del(c._id)} aria-label="Delete campaign" style={{ color: 'rgba(var(--text) / 0.35)' }} className="hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {loadError && (
          <div className="col-span-2 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)', color: 'rgba(var(--text) / 0.3)' }}>
            Failed to load — check your connection and try refreshing.
          </div>
        )}
        {!loadError && campaigns.length === 0 && (
          <div className="col-span-2 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)', color: 'rgba(var(--text) / 0.3)' }}>
            No campaigns yet — create one to start drafting outreach.
          </div>
        )}
      </div>

      {creating && (
        <Modal
          onClose={() => setCreating(null)}
          containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur"
          className="p-6 max-w-lg w-full rounded-2xl"
          style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}
        >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>New Campaign</h2>
              <button onClick={() => setCreating(null)} style={{ color: 'rgba(var(--text) / 0.5)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control" placeholder="Campaign name (e.g. 'Hospital ERP — Bihar, July 2026')" value={creating.name} onChange={e => setCreating({ ...creating, name: e.target.value })} />
              <select className="form-control" value={creating.channel} onChange={e => setCreating({ ...creating, channel: e.target.value as any })}>
                <option value="email" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Cold Email</option>
                <option value="linkedin" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>LinkedIn</option>
              </select>
              {creating.channel === 'email' && (
                <input className="form-control" placeholder="Subject template (use {{name}}, {{company}})" value={creating.subjectTemplate} onChange={e => setCreating({ ...creating, subjectTemplate: e.target.value })} />
              )}
              <textarea className="form-control" rows={6} placeholder="Message template — use {{name}} and {{company}} as placeholders" value={creating.bodyTemplate} onChange={e => setCreating({ ...creating, bodyTemplate: e.target.value })} />
              {creating.channel === 'email' && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(var(--surface) / 0.04)', border: '1px solid rgba(var(--border) / 0.06)' }}>
                  <label className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
                    <input type="checkbox" checked={creating.autoSend} onChange={e => setCreating({ ...creating, autoSend: e.target.checked })} />
                    Auto-send (AI writes, sends, replies & negotiates — no per-message review)
                  </label>
                  {creating.autoSend && (
                    <div className="mt-2 flex items-center gap-2 text-[12px]" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                      Max per day:
                      <input type="number" min={1} max={100} className="form-control py-1 w-20" value={creating.dailySendLimit} onChange={e => setCreating({ ...creating, dailySendLimit: Number(e.target.value) || 15 })} />
                    </div>
                  )}
                </div>
              )}
              <button onClick={save} disabled={saving || !creating.name || !creating.bodyTemplate} className="btn btn-primary w-full justify-center">
                <Send className="w-4 h-4" /> {saving ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
        </Modal>
      )}

      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur"
          className="p-6 max-w-lg w-full rounded-2xl"
          style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}
        >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>Edit Campaign</h2>
              <button onClick={() => setEditing(null)} style={{ color: 'rgba(var(--text) / 0.5)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control" placeholder="Campaign name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <select className="form-control" value={editing.channel} onChange={e => setEditing({ ...editing, channel: e.target.value as any })}>
                <option value="email" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Cold Email</option>
                <option value="linkedin" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>LinkedIn</option>
              </select>
              <select className="form-control" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                <option value="draft" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Draft</option>
                <option value="active" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Active</option>
                <option value="paused" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Paused</option>
              </select>
              {editing.channel === 'email' && (
                <input className="form-control" placeholder="Subject template (use {{name}}, {{company}})" value={editing.subjectTemplate} onChange={e => setEditing({ ...editing, subjectTemplate: e.target.value })} />
              )}
              <textarea className="form-control" rows={6} placeholder="Message template — use {{name}} and {{company}} as placeholders" value={editing.bodyTemplate} onChange={e => setEditing({ ...editing, bodyTemplate: e.target.value })} />
              {editing.channel === 'email' && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(var(--surface) / 0.04)', border: '1px solid rgba(var(--border) / 0.06)' }}>
                  <label className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
                    <input type="checkbox" checked={editing.autoSend} onChange={e => setEditing({ ...editing, autoSend: e.target.checked })} />
                    Auto-send (AI writes, sends, replies & negotiates — no per-message review)
                  </label>
                  {editing.autoSend && (
                    <div className="mt-2 flex items-center gap-2 text-[12px]" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                      Max per day:
                      <input type="number" min={1} max={100} className="form-control py-1 w-20" value={editing.dailySendLimit} onChange={e => setEditing({ ...editing, dailySendLimit: Number(e.target.value) || 15 })} />
                    </div>
                  )}
                </div>
              )}
              <button onClick={saveEdit} disabled={saving || !editing.name || !editing.bodyTemplate} className="btn btn-primary w-full justify-center">
                <Send className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
}
