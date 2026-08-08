'use client';
import { useState } from 'react';
import { Loader2, Sparkles, Phone, CheckCircle } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

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
  const [form, setForm] = useState({ name: '', phone: '', websiteType: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doneName, setDoneName] = useState<string | null>(null);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackDone, setCallbackDone] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || form.phone.trim().length < 7 || !form.websiteType.trim() || !form.email.trim()) {
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
          businessType: form.websiteType,
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

  // Lighter-weight alternative to the full quote form — its own separate
  // Name + Phone mini-form, for visitors who want a call but don't want to
  // fill in email/website type first.
  const requestCallback = async () => {
    setError('');
    if (cbPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setCallbackLoading(true);
    try {
      const r = await fetch('/api/call-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName || 'Customer', phone: cbPhone,
          source: 'independence-day-website-offer-callback',
          message: 'Customer requested a callback from the ₹999 Independence Day website-offer page.',
        }),
      }).then(x => x.json());
      if (r.ok) {
        trackEvent('lead_submit', { source: 'independence-day-website-offer-callback' }, r.leadId);
        setCallbackDone(true);
      } else {
        setError(r.error || 'Could not request a callback. Please try again.');
      }
    } catch {
      setError('Could not request a callback. Please try again.');
    } finally {
      setCallbackLoading(false);
    }
  };

  if (doneName !== null) return <ThankYouCard name={doneName} />;

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-5 shadow-2xl space-y-2.5 w-full max-w-sm">
      <div className="text-center mb-1">
        <div className="text-sm font-extrabold text-gray-900">Get Your Free Quote</div>
        <div className="text-[11px] text-gray-500">Share your details and we will contact you soon</div>
      </div>
      {!showCallbackForm && !callbackDone && (
        <>
          <input className={INPUT_CLS} placeholder="Full Name *" value={form.name} onChange={set('name')} required />
          <input type="tel" className={INPUT_CLS} placeholder="Mobile Number *" value={form.phone} onChange={set('phone')} required />
          <input className={INPUT_CLS} placeholder="Website Type (e.g. Portfolio, Restaurant, Shop) *" value={form.websiteType} onChange={set('websiteType')} required />
          <input type="email" className={INPUT_CLS} placeholder="Email Address" value={form.email} onChange={set('email')} required />
        </>
      )}
      {error && <p className="text-red-600 text-xs">{error}</p>}

      {callbackDone ? (
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm py-2.5">
          <CheckCircle className="w-4 h-4" /> We will call you back within 4 hours!
        </div>
      ) : showCallbackForm ? (
        <div className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
          <p className="text-xs font-bold text-gray-700">We will call you back — just your name &amp; number:</p>
          <input className={INPUT_CLS} placeholder="Your Name (optional)" value={cbName} onChange={e => setCbName(e.target.value)} />
          <input type="tel" className={INPUT_CLS} placeholder="Mobile Number *" value={cbPhone} onChange={e => setCbPhone(e.target.value)} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={requestCallback}
              disabled={callbackLoading}
              className="flex-1 py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              {callbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              {callbackLoading ? 'Requesting...' : 'Request Callback'}
            </button>
            <button type="button" onClick={() => { setShowCallbackForm(false); setError(''); }} className="px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="submit" disabled={submitting}
            className="flex-1 py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg,#FF9933,#e07b1a)' }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Get Free Quote'}
          </button>
          <button
            type="button"
            onClick={() => setShowCallbackForm(true)}
            className="flex-1 py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" /> Call Me Back
          </button>
        </div>
      )}

      <div className="text-center text-[10px] text-gray-400">100% Privacy Guaranteed</div>
    </form>
  );
}
