'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ShieldCheck, Clock, Sparkles, Phone, CheckCircle } from 'lucide-react';
import { IndianFlag } from '@/components/shared/IndianFlag';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

// Explicit, theme-independent styling — this page is a standalone light-mode
// campaign design, so inputs must not pick up the shared ".form-control"
// class's html.dark override (near-white text on our white card would be
// unreadable if a visitor's system/site theme is set to dark).
const INPUT_CLS = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

export function GetQuoteClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', websiteType: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
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
          source: 'independence-day-ads',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.error || 'Could not submit — please try again or WhatsApp us.');
        setSubmitting(false);
        return;
      }
      trackEvent('lead_submit', { source: 'independence-day-ads', service: 'Website (Independence Day Offer)' }, d.id);
      const qs = new URLSearchParams({ lead: d.id, name: form.name });
      const utm = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
      router.push(`/website-offer?${qs.toString()}${utm ? `&${utm}` : ''}`);
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
        body: JSON.stringify({ name: cbName || 'Customer', phone: cbPhone }),
      }).then(x => x.json());
      if (r.ok) {
        trackEvent('lead_submit', { source: 'independence-day-ads-callback' }, r.leadId);
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
            <label htmlFor="gq-website-type" className="sr-only">Website Type</label>
            <input id="gq-website-type" className={INPUT_CLS} placeholder="Website Type (e.g. Portfolio, Restaurant, Shop) *" value={form.websiteType} onChange={set('websiteType')} required />
          </div>
          <div>
            <label htmlFor="gq-email" className="sr-only">Email Address</label>
            <input id="gq-email" type="email" autoComplete="email" className={INPUT_CLS} placeholder="Email Address *" value={form.email} onChange={set('email')} required />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          {callbackDone ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm py-3">
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
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg,#FF9933,#e07b1a)' }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Get Free Quote'}
              </button>
              <button
                type="button"
                onClick={() => setShowCallbackForm(true)}
                className="flex-1 py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Me Back
              </button>
            </div>
          )}

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
