'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ShieldCheck, Clock, ArrowRight, Phone, CheckCircle } from 'lucide-react';
import { LiveSocialProof } from '@/components/shared/LiveSocialProof';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

// Explicit, theme-independent styling — this page is a standalone dark
// campaign design (always dark, regardless of the site's light/dark toggle),
// so nothing here reads `html.dark` state; every color is spelled out.
const INPUT_CLS = 'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gold focus:ring-4 focus:ring-gold/10';

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
          service: 'Website',
          source: 'website-quote-ads',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.error || 'Could not submit — please try again or WhatsApp us.');
        setSubmitting(false);
        return;
      }
      trackEvent('lead_submit', { source: 'website-quote-ads', service: 'Website' }, d.id);
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
        body: JSON.stringify({
          name: cbName || 'Customer', phone: cbPhone,
          source: 'website-quote-ads-callback',
          message: 'Customer requested a callback from the website quote ad landing page (/get-quote).',
        }),
      }).then(x => x.json());
      if (r.ok) {
        trackEvent('lead_submit', { source: 'website-quote-ads-callback' }, r.leadId);
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
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 70% at 50% -5%, rgba(200,168,112,0.16), transparent 55%), linear-gradient(165deg, #05070f 0%, #0b1230 48%, #05070f 100%)',
      }}
    >
      {/* Thin gold seam along the top edge */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#c8a870,#e8c890,#c8a870)' }} />

      {/* Dot-grid texture — spelled out explicitly (not the shared .dot-grid
          class) because this background is always dark regardless of the
          site's light/dark theme toggle. */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 30%, transparent 100%)',
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 py-6 sm:py-14">
        <div className="relative z-10 w-full max-w-md animate-fade-up">
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full text-gold-light border border-gold/40 bg-gold/10 mb-4">
              Limited Time Offer
            </span>
            <h1 className="text-[28px] sm:text-4xl font-extrabold text-white leading-[1.12] mb-3">
              A Professional Website,<br />
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-gradient-to-r from-gold-light to-gold text-ink font-black -rotate-1 whitespace-nowrap">Built For You</span>
            </h1>
            <p className="text-white/55 text-sm max-w-sm mx-auto leading-relaxed">
              Share your details — our team calls you personally with a free quote, usually within the hour.
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <LiveSocialProof path="/get-quote" dark />
          </div>

          <div className="relative rounded-2xl p-[2px] shadow-glow-gold" style={{ background: 'linear-gradient(160deg,#c8a870,#e8c890 50%,#c8a870)' }}>
            <form onSubmit={submit} className="rounded-[14px] p-5 sm:p-7 space-y-2.5 sm:space-y-3" style={{ background: 'linear-gradient(180deg,#fbf7ee 0%,#ffffff 45%,#fbf7ee 100%)' }}>
              {!showCallbackForm && !callbackDone && (
                <>
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
                </>
              )}

              {error && <p className="text-red-600 text-xs">{error}</p>}

              {callbackDone ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm py-3">
                  <CheckCircle className="w-4 h-4" /> We will call you back within 1 hour!
                </div>
              ) : showCallbackForm ? (
                <div className="border border-gray-200 rounded-xl p-3.5 space-y-2 bg-gray-50/80">
                  <p className="text-xs font-bold text-gray-700">We will call you back — just your name &amp; number:</p>
                  <label htmlFor="gq-cb-name" className="sr-only">Your Name</label>
                  <input id="gq-cb-name" className={INPUT_CLS} placeholder="Your Name (optional)" value={cbName} onChange={e => setCbName(e.target.value)} />
                  <label htmlFor="gq-cb-phone" className="sr-only">Mobile Number</label>
                  <input id="gq-cb-phone" type="tel" className={INPUT_CLS} placeholder="Mobile Number *" value={cbPhone} onChange={e => setCbPhone(e.target.value)} />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={requestCallback}
                      disabled={callbackLoading}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
                    >
                      {callbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      {callbackLoading ? 'Requesting...' : 'Request Callback'}
                    </button>
                    <button type="button" onClick={() => { setShowCallbackForm(false); setError(''); }} className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-700">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 rounded-xl font-bold text-ink text-sm flex items-center justify-center gap-2 transition-all hover:shadow-glow-gold disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#e8c890,#c8a870)' }}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Get Free Quote'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCallbackForm(true)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Me Back
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Privacy Guaranteed</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> Reply within 1 hour</span>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Image src="/brand-logo.png" alt="KVL Business Solutions" width={120} height={37} className="opacity-70" />
            <a href="tel:+919942000413" className="text-white/45 text-xs hover:text-gold-light transition-colors flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Prefer to talk now? Call +91 99420 00413
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
