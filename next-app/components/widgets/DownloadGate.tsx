'use client';
import { useState } from 'react';
import { Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

export function DownloadGate({
  icon: Icon,
  title,
  desc,
  downloadHref,
  downloadType,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  downloadHref: string;
  downloadType: string;
}) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          source: `download-${downloadType}`,
          message: `Requested download: ${title}`,
        }),
      });
      if (!res.ok) throw new Error();
      setUnlocked(true);
      setStatus('idle');
      // Best-effort — the PDF is still reachable via "Open Download" below
      // even if emailing it fails, so this never blocks unlocking.
      fetch('/api/downloads/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: downloadType, name: form.name, email: form.email }),
      }).catch(() => {});
    } catch { setStatus('error'); }
  };

  return (
    <div className="card-base p-6">
      <Icon className="w-6 h-6 mb-3" style={{ color: '#a3814f' }} />
      <h3 className="font-bold text-sm mb-1.5">{title}</h3>
      <p className="text-text2 text-[12.5px] leading-[1.6] mb-4">{desc}</p>

      {unlocked ? (
        <div>
          <a
            href={downloadHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('download_click', { type: downloadType })}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: '#c8a870' }}
          >
            <CheckCircle2 className="w-4 h-4" /> Open Download
          </a>
          <p className="text-text2 text-[11px] mt-1.5">A PDF copy is also on its way to your email.</p>
        </div>
      ) : open ? (
        <form onSubmit={submit} className="space-y-2">
          <input required placeholder="Your name" className="form-control text-xs py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" className="form-control text-xs py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Phone" className="form-control text-xs py-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full justify-center text-xs py-2 disabled:opacity-60">
            {status === 'sending' ? 'Please wait…' : 'Get Download Link'}
          </button>
          {status === 'error' && <p className="text-red-500 text-[11px]">Something went wrong — try again.</p>}
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: '#c8a870' }}>
          <Download className="w-4 h-4" /> Download <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
