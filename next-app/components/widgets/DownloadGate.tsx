'use client';
import { useState } from 'react';
import { Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { Card, Input, Button } from '@/components/ui';

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
    <Card className="p-6">
      <Icon aria-hidden className="mb-3 h-6 w-6 text-gold-text" />
      <h3 className="mb-1.5 font-display text-card-title text-text">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-text2">{desc}</p>

      {unlocked ? (
        <div>
          <a
            href={downloadHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('download_click', { type: downloadType })}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-btn text-sm font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <CheckCircle2 aria-hidden className="h-4 w-4" /> Open Download
          </a>
          <p className="mt-1.5 text-xs text-text2">A PDF copy is also on its way to your email.</p>
        </div>
      ) : open ? (
        <form onSubmit={submit} className="space-y-2.5">
          <Input required aria-label="Your name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input required type="email" aria-label="Email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input required aria-label="Phone" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Button type="submit" disabled={status === 'sending'} className="w-full">
            {status === 'sending' ? 'Please wait…' : 'Get Download Link'}
          </Button>
          {status === 'error' && <p role="alert" className="text-sm text-red-500">Something went wrong — try again.</p>}
        </form>
      ) : (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Download aria-hidden className="h-4 w-4" /> Download <ArrowRight aria-hidden className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
