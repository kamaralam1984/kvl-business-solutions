'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Gauge, Bot } from 'lucide-react';
import { trackEvent } from '@/components/analytics/track';

type MagnetType = 'audit' | 'ai-consultation';

const COPY: Record<MagnetType, { title: string; sub: string; Icon: typeof Gauge; contextLabel: string; contextPlaceholder: string; service: string }> = {
  audit: {
    title: 'Get Your Free Website Audit',
    sub: 'A real engineer reviews your site\'s SEO, speed, and conversion setup — no bot-generated report.',
    Icon: Gauge,
    contextLabel: 'Website URL',
    contextPlaceholder: 'https://yourcompany.com',
    service: 'Free Website Audit',
  },
  'ai-consultation': {
    title: 'Free AI Automation Consultation',
    sub: '30 minutes with a solution architect to map where AI/automation actually saves your team time.',
    Icon: Bot,
    contextLabel: 'What do you want to automate?',
    contextPlaceholder: 'e.g. lead follow-up, invoicing, support replies',
    service: 'Free AI Automation Consultation',
  },
};

// Opens the modal from anywhere: openLeadMagnet('audit') or openLeadMagnet('ai-consultation').
export const openLeadMagnet = (type: MagnetType) =>
  document.dispatchEvent(new CustomEvent('open-lead-magnet', { detail: { type } }));

export function LeadMagnetModal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MagnetType>('audit');
  const [form, setForm] = useState({ name: '', email: '', phone: '', context: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const h = (e: Event) => {
      const detail = (e as CustomEvent).detail as { type?: MagnetType } | undefined;
      setType(detail?.type === 'ai-consultation' ? 'ai-consultation' : 'audit');
      setOpen(true);
    };
    document.addEventListener('open-lead-magnet', h);
    return () => document.removeEventListener('open-lead-magnet', h);
  }, []);

  const copy = COPY[type];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          service: copy.service,
          message: `[${copy.contextLabel}] ${form.context}`,
          source: `lead-magnet-${type}`,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.error || 'Could not submit your request. Please try again or WhatsApp us.');
        return;
      }
      setDone(true);
      trackEvent('lead_submit', { source: `lead-magnet-${type}` });
    } catch {
      setError('Could not submit your request. Please try again or WhatsApp us.');
    } finally { setSubmitting(false); }
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => { setDone(false); setError(''); setForm({ name: '', email: '', phone: '', context: '' }); }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="bg-app2 border border-tint rounded-2xl p-7 max-w-md w-full relative"
          >
            <button onClick={close} className="absolute top-3 right-4 text-text2" aria-label="Close"><X /></button>

            {done ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 grid place-items-center mx-auto mb-3">
                  <copy.Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-1">Request received</h3>
                <p className="text-sm text-text2">Our team will reach out within 1 business day.</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 grid place-items-center mb-3">
                  <copy.Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">{copy.title}</h3>
                <p className="text-sm text-text2 mb-5">{copy.sub}</p>
                <form onSubmit={submit} className="space-y-2.5">
                  <input required placeholder="Your name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control w-full text-sm" />
                  <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-control w-full text-sm" />
                  <input required placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-control w-full text-sm" />
                  <input placeholder={copy.contextPlaceholder} value={form.context} onChange={e => setForm({ ...form, context: e.target.value })} className="form-control w-full text-sm" />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button disabled={submitting} className="btn btn-primary w-full justify-center mt-1">
                    <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Get Started — Free'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
