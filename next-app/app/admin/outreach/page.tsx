'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, X, Mail, Linkedin, Send, MessageCircle, CalendarCheck } from 'lucide-react';

type Campaign = {
  _id: string; name: string; channel: 'email' | 'linkedin';
  subjectTemplate: string; bodyTemplate: string; status: string;
  statusCounts: Record<string, number>;
};

const empty = { name: '', channel: 'email' as const, subjectTemplate: '', bodyTemplate: '' };

export default function OutreachCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creating, setCreating] = useState<typeof empty | null>(null);
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

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>Outreach CRM</h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Drafts only — nothing sends automatically. Generate a draft, review it, then send from your own inbox or LinkedIn.
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
            <Link key={c._id} href={`/admin/outreach/${c._id}`} className="rounded-2xl p-5 block transition-colors hover:bg-[rgba(var(--surface)/0.03)]" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {c.channel === 'email' ? <Mail className="w-4 h-4 text-primary" /> : <Linkedin className="w-4 h-4 text-primary" />}
                  <h3 className="font-bold" style={{ color: 'rgb(var(--text))' }}>{c.name}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(var(--surface) / 0.08)', color: c.status === 'active' ? '#4ade80' : 'rgba(var(--text) / 0.5)' }}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[12px] mt-3" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                <span>{total} prospects</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {replied} replied</span>
                <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {meetings} meetings</span>
              </div>
            </Link>
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
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur" onClick={() => setCreating(null)}>
          <div className="p-6 max-w-lg w-full rounded-2xl" style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }} onClick={e => e.stopPropagation()}>
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
              <button onClick={save} disabled={saving || !creating.name || !creating.bodyTemplate} className="btn btn-primary w-full justify-center">
                <Send className="w-4 h-4" /> {saving ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
