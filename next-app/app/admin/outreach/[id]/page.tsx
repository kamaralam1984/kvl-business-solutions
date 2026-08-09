'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Copy, Mail, ExternalLink, Trash2, HeartHandshake, ClipboardList } from 'lucide-react';
import { PROSPECT_STATUSES } from '@/lib/models/OutreachProspect';

type Campaign = { _id: string; name: string; channel: 'email' | 'linkedin'; subjectTemplate: string; bodyTemplate: string };
type Prospect = {
  _id: string; name: string; email?: string; linkedinUrl?: string; company?: string;
  status: string; notes?: string; convertedDealId?: string; lastContactedAt?: string;
};

// Fills {{name}} / {{company}} in a template — the only "generation" this
// system does. No AI call, no send — just string substitution the admin
// reviews before copying into their own email client or LinkedIn.
function fillTemplate(tpl: string, p: Prospect) {
  return (tpl || '').replace(/\{\{name\}\}/g, p.name || '').replace(/\{\{company\}\}/g, p.company || 'your company');
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [openDraftId, setOpenDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch(`/api/admin/outreach/campaigns/${id}`).then(r => r.json()).then(d => {
      if (d.ok) { setCampaign(d.campaign); setProspects(d.prospects); } else { setLoadError(true); }
    }).catch(() => setLoadError(true)).finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [id]);

  const addBulk = async () => {
    // One prospect per line: "Name, email, company" (email/company optional)
    const rows = bulkText.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const [name, email, company] = line.split(',').map(s => s.trim());
      return { name, email: email || '', company: company || '' };
    }).filter(r => r.name);
    if (rows.length === 0) return;
    const r = await fetch('/api/admin/outreach/prospects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: id, prospects: rows }),
    });
    const d = await r.json();
    if (d.ok) { setBulkText(''); setBulkOpen(false); load(); } else alert(d.error || 'Failed');
  };

  const setStatus = async (p: Prospect, status: string) => {
    await fetch(`/api/admin/outreach/prospects/${p._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, markContacted: status === 'sent' }),
    });
    load();
  };

  const del = async (p: Prospect) => {
    if (!confirm(`Remove ${p.name} from this campaign?`)) return;
    await fetch(`/api/admin/outreach/prospects/${p._id}`, { method: 'DELETE' });
    load();
  };

  const convert = async (p: Prospect) => {
    if (!confirm(`Convert ${p.name} into a real CRM deal?`)) return;
    const r = await fetch(`/api/admin/outreach/prospects/${p._id}/convert`, { method: 'POST' });
    const d = await r.json();
    if (d.ok) { router.push('/dashboard/crm'); } else alert(d.error || 'Failed');
  };

  if (loading) return null;

  if (!campaign) {
    return (
      <div className="space-y-6 max-w-5xl">
        <button onClick={() => router.push('/admin/outreach')} className="text-[12px] flex items-center gap-1" style={{ color: 'rgba(var(--text) / 0.5)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> All campaigns
        </button>
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)', color: 'rgba(var(--text) / 0.4)' }}
        >
          {loadError ? 'Failed to load campaign — check your connection and try refreshing.' : 'Campaign not found.'}
        </div>
      </div>
    );
  }

  const total = prospects.length;
  const sent = prospects.filter(p => ['sent', 'opened', 'replied', 'meeting_booked'].includes(p.status)).length;
  const replied = prospects.filter(p => ['replied', 'meeting_booked'].includes(p.status)).length;
  const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => router.push('/admin/outreach')} className="text-[12px] flex items-center gap-1" style={{ color: 'rgba(var(--text) / 0.5)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> All campaigns
      </button>

      <div>
        <h1 className="font-display font-black text-[1.6rem] tracking-tight" style={{ color: 'rgb(var(--text))' }}>{campaign.name}</h1>
        <div className="flex gap-4 text-[12.5px] mt-2" style={{ color: 'rgba(var(--text) / 0.4)' }}>
          <span>{total} prospects</span><span>{sent} contacted</span><span>{replied} replied</span><span>{replyRate}% reply rate — real, manually tracked</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setBulkOpen(!bulkOpen)} className="btn btn-primary"><Plus className="w-4 h-4" /> Add Prospects</button>
      </div>

      {bulkOpen && (
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
          <p className="text-[12px] mb-2" style={{ color: 'rgba(var(--text) / 0.4)' }}>One per line: <code>Name, email, company</code> — email and company optional.</p>
          <textarea className="form-control" rows={6} placeholder={'Dr. Sharma, dr.sharma@hospital.com, Sharma Hospital\nRakesh Gupta, , Gupta Textiles'} value={bulkText} onChange={e => setBulkText(e.target.value)} />
          <button onClick={addBulk} className="btn btn-primary mt-3">Add to Campaign</button>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(var(--text) / 0.35)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <tr><th className="p-3">Prospect</th><th className="p-3">Status</th><th className="p-3">Draft</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {prospects.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}>
                <td className="p-3">
                  <div className="font-semibold" style={{ color: 'rgb(var(--text))' }}>{p.name}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.4)' }}>{p.company}{p.email ? ` · ${p.email}` : ''}</div>
                </td>
                <td className="p-3">
                  <select
                    className="form-control text-xs py-1"
                    value={p.status}
                    onChange={e => setStatus(p, e.target.value)}
                  >
                    {PROSPECT_STATUSES.map(s => <option key={s} value={s} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{s.replace('_', ' ')}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => setOpenDraftId(openDraftId === p._id ? null : p._id)} className="text-[11px] flex items-center gap-1" style={{ color: 'rgba(var(--text) / 0.5)' }}>
                    <ClipboardList className="w-3.5 h-3.5" /> {openDraftId === p._id ? 'Hide' : 'Generate draft'}
                  </button>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {!p.convertedDealId ? (
                    <button onClick={() => convert(p)} title="Convert to CRM deal" className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><HeartHandshake className="w-4 h-4" /></button>
                  ) : (
                    <span className="text-[10px] font-bold text-green-400 mr-1">In CRM</span>
                  )}
                  <button onClick={() => del(p)} className="p-1 inline-block" style={{ color: 'rgba(var(--text) / 0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {prospects.length === 0 && <tr><td colSpan={4} className="p-8 text-center" style={{ color: 'rgba(var(--text) / 0.3)' }}>No prospects yet — add some above.</td></tr>}
          </tbody>
        </table>
      </div>

      {prospects.filter(p => p._id === openDraftId).map(p => {
        const subject = fillTemplate(campaign.subjectTemplate, p);
        const body = fillTemplate(campaign.bodyTemplate, p);
        const mailto = `mailto:${p.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return (
          <div key={p._id} className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
            <h3 className="font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>Draft for {p.name}</h3>
            {campaign.channel === 'email' && subject && (
              <p className="text-[12px] mb-2" style={{ color: 'rgba(var(--text) / 0.5)' }}><b>Subject:</b> {subject}</p>
            )}
            <pre className="whitespace-pre-wrap text-[13px] p-3 rounded-lg mb-3" style={{ background: 'rgba(var(--surface) / 0.03)', color: 'rgba(var(--text) / 0.7)' }}>{body}</pre>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => { navigator.clipboard.writeText(body); }} className="btn text-xs" style={{ background: 'rgba(var(--surface) / 0.08)', color: 'rgb(var(--text))' }}>
                <Copy className="w-3.5 h-3.5" /> Copy text
              </button>
              {campaign.channel === 'email' && p.email && (
                <a href={mailto} onClick={() => setStatus(p, 'sent')} className="btn btn-primary text-xs">
                  <Mail className="w-3.5 h-3.5" /> Open in my email client
                </a>
              )}
              {campaign.channel === 'linkedin' && p.linkedinUrl && (
                <a href={p.linkedinUrl} target="_blank" rel="noreferrer" onClick={() => setStatus(p, 'sent')} className="btn btn-primary text-xs">
                  <ExternalLink className="w-3.5 h-3.5" /> Open LinkedIn profile
                </a>
              )}
            </div>
            <p className="text-[10.5px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
              Nothing is sent from here — this opens your own email client / LinkedIn tab, and you send it yourself.
            </p>
          </div>
        );
      })}
    </div>
  );
}
