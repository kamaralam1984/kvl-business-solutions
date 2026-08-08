'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { IndianFlag } from '@/components/shared/IndianFlag';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

const CATEGORIES = [
  'Retail / Shop', 'Restaurant / Cafe', 'Real Estate', 'Healthcare / Clinic',
  'Education / Coaching', 'Manufacturing', 'IT / Software', 'Construction',
  'Professional Services', 'Beauty / Salon', 'NGO / Trust', 'Other',
];

// Explicit, theme-independent styling — this page is a standalone light-mode
// campaign design, so inputs must not pick up the shared ".form-control"
// class's html.dark override (near-white text on our white card would be
// unreadable if a visitor's system/site theme is set to dark).
const INPUT_CLS = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

export function GetQuoteClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', companyName: '', businessType: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
          source: 'independence-day-ads',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.error || 'Could not submit — please try again or WhatsApp us.');
        setSubmitting(false);
        return;
      }
      trackEvent('lead_submit', { source: 'independence-day-ads', service: 'Website (Independence Day Offer)' });
      const qs = new URLSearchParams({ lead: d.id, name: form.name });
      const utm = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
      router.push(`/website-offer?${qs.toString()}${utm ? `&${utm}` : ''}`);
    } catch {
      setError('Could not submit — please try again or WhatsApp us.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0b1a3a 0%,#0f1f4a 45%,#0b1a3a 100%)' }}
    >
      {/* Tricolor top/bottom ribbons */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg,#FF9933,#FFFFFF,#138808)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg,#138808,#FFFFFF,#FF9933)' }} />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: '#FF9933' }} />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: '#138808' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <IndianFlag width={110} />
        </div>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-3" style={{ background: 'linear-gradient(90deg,#FF9933,#138808)' }}>
            <Sparkles className="w-3 h-3" /> 15th August Independence Day Special
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
            Get Your Website Starting at <span style={{ color: '#FF9933' }}>₹999</span>
          </h1>
          <p className="text-white/70 text-sm">Share your details — our team will call you with a free quote in minutes.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-3">
          <div>
            <label htmlFor="gq-name" className="sr-only">Full Name</label>
            <input id="gq-name" autoComplete="name" className={INPUT_CLS} placeholder="Full Name *" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label htmlFor="gq-phone" className="sr-only">Mobile Number</label>
            <input id="gq-phone" type="tel" autoComplete="tel" className={INPUT_CLS} placeholder="Mobile Number *" value={form.phone} onChange={set('phone')} required />
          </div>
          <div>
            <label htmlFor="gq-company" className="sr-only">Business Name</label>
            <input id="gq-company" autoComplete="organization" className={INPUT_CLS} placeholder="Business Name *" value={form.companyName} onChange={set('companyName')} required />
          </div>
          <div>
            <label htmlFor="gq-category" className="sr-only">Business Category</label>
            <select id="gq-category" className={INPUT_CLS} value={form.businessType} onChange={set('businessType')} required>
              <option value="">Select Business Category *</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="gq-email" className="sr-only">Email Address</label>
            <input id="gq-email" type="email" autoComplete="email" className={INPUT_CLS} placeholder="Email Address *" value={form.email} onChange={set('email')} required />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg,#FF9933,#e07b1a)' }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Get Free Quote'}
          </button>

          <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> 100% Privacy Guaranteed</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Reply within 1 hour</span>
          </div>
        </form>

        <div className="flex justify-center mt-5">
          <Image src="/brand-logo.png" alt="KVL Business Solutions" width={120} height={37} className="opacity-80" />
        </div>
      </div>
    </div>
  );
}
