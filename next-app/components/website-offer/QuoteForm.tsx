'use client';
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

const CATEGORIES = [
  'Retail / Shop', 'Restaurant / Cafe', 'Real Estate', 'Healthcare / Clinic',
  'Education / Coaching', 'Manufacturing', 'IT / Software', 'Construction',
  'Professional Services', 'Beauty / Salon', 'NGO / Trust', 'Other',
];

// Explicit, theme-independent styling — see app/get-quote/GetQuoteClient.tsx
// for why this doesn't use the shared ".form-control" class.
const INPUT_CLS = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

export function ThankYouCard({ name }: { name?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center">
      <div className="text-4xl mb-2">🎉</div>
      <div className="font-extrabold text-gray-900 mb-1">{name ? `Thanks, ${name}!` : 'Thanks!'}</div>
      <p className="text-sm text-gray-600 mb-4">Our team will call you shortly with your free quote. Meanwhile, check out our plans below.</p>
      <a href="#pricing" className="inline-block w-full py-2.5 rounded-lg font-bold text-white text-sm" style={{ background: 'linear-gradient(90deg,#FF9933,#e07b1a)' }}>
        See Pricing Plans
      </a>
    </div>
  );
}

// Self-contained: manages its own post-submit "thank you" state, so it can
// be used both as a live component and as a Suspense fallback with no
// external state wiring needed.
export function QuoteForm() {
  const [form, setForm] = useState({ name: '', phone: '', companyName: '', businessType: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doneName, setDoneName] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || form.phone.trim().length < 7 || !form.companyName.trim() || !form.businessType || !form.email.trim()) {
      setError('Please fill in every field.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          companyName: form.companyName, businessType: form.businessType,
          service: 'Website (Independence Day Offer)',
          source: 'independence-day-website-offer',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) { setError(d.error || 'Could not submit — please try again or WhatsApp us.'); setSubmitting(false); return; }
      trackEvent('lead_submit', { source: 'independence-day-website-offer', service: 'Website (Independence Day Offer)' }, d.id);
      setDoneName(form.name);
    } catch {
      setError('Could not submit — please try again or WhatsApp us.');
      setSubmitting(false);
    }
  };

  if (doneName !== null) return <ThankYouCard name={doneName} />;

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-5 shadow-2xl space-y-2.5 w-full max-w-sm">
      <div className="text-center mb-1">
        <div className="text-sm font-extrabold text-gray-900">Get Your Free Quote</div>
        <div className="text-[11px] text-gray-500">Share your details and we will contact you soon</div>
      </div>
      <input className={INPUT_CLS} placeholder="Full Name *" value={form.name} onChange={set('name')} required />
      <input type="tel" className={INPUT_CLS} placeholder="Mobile Number *" value={form.phone} onChange={set('phone')} required />
      <input className={INPUT_CLS} placeholder="Business Name *" value={form.companyName} onChange={set('companyName')} required />
      <select className={INPUT_CLS} value={form.businessType} onChange={set('businessType')} required>
        <option value="">Select Category *</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="email" className={INPUT_CLS} placeholder="Email Address" value={form.email} onChange={set('email')} required />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        type="submit" disabled={submitting}
        className="w-full py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: 'linear-gradient(90deg,#FF9933,#e07b1a)' }}
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {submitting ? 'Submitting...' : 'Get Free Quote'}
      </button>
      <div className="text-center text-[10px] text-gray-400">100% Privacy Guaranteed</div>
    </form>
  );
}
