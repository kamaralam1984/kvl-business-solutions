'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Send, CalendarClock } from 'lucide-react';
import { buttonStyles } from '@/components/ui';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { BUDGET_OPTIONS, TIMELINE_OPTIONS, BUSINESS_TYPE_OPTIONS, COUNTRY_OPTIONS } from '@/lib/lead-tier';

const FIELD = 'w-full min-h-[44px] rounded-btn border border-line bg-card px-4 text-base text-text placeholder:text-text3 transition-shadow duration-base focus-visible:outline-none focus-visible:border-gold focus-visible:shadow-[var(--focus-ring)]';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
  </svg>
);

export function ContactClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    companyName: '', country: 'India', businessType: BUSINESS_TYPE_OPTIONS[0],
    service: 'Custom Software Development', budget: BUDGET_OPTIONS[0], timeline: TIMELINE_OPTIONS[0],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const s = settings;
  const phoneText = [s.phone, s.phone2].filter(Boolean).join('\n');
  const waNumber = s.whatsapp?.startsWith('+') ? s.whatsapp : `+${s.whatsapp}`;
  const emailText = [s.email, s.salesEmail].filter(Boolean).join('\n');
  const officeText = [s.addressLine1, s.addressLine2, s.branches ? `Branches: ${s.branches}` : ''].filter(Boolean).join('\n');
  const hoursText = [s.businessHours, s.emergencySupport].filter(Boolean).join('\n');

  const items = [
    { Icon: Phone, title: 'Call Us', text: phoneText },
    { Icon: WaIcon, title: 'WhatsApp', text: `${waNumber}\n${s.whatsappSupportText || '24×7 support'}`, isWa: true },
    { Icon: Mail, title: 'Email', text: emailText },
    { Icon: MapPin, title: 'Head Office', text: officeText },
    { Icon: Clock, title: 'Business Hours', text: hoursText },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone,
          companyName: form.companyName, country: form.country, businessType: form.businessType,
          service: form.service, budget: form.budget, timeline: form.timeline, message: form.message,
          source: 'contact-form',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setErrorMsg(d.error || 'Could not send. Please try WhatsApp.');
        setStatus('error');
        return;
      }
      trackEvent('lead_submit', { source: 'contact-form', service: form.service }, d.id);
      setStatus('success');
      router.push('/thank-you?type=contact');
    } catch {
      setErrorMsg('Could not send. Please try WhatsApp.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-bg pb-[var(--section-y)]">
      <div className="container grid lg:grid-cols-[1fr_1.4fr] gap-10">

        {/* Info Cards */}
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.title} className="flex items-start gap-4 rounded-card border border-line bg-card p-5 shadow-soft-1">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-btn bg-gold/15 text-gold-text"><it.Icon /></div>
                <div>
                  <h3 className="text-base font-semibold text-text">{it.title}</h3>
                  <p className="mt-0.5 whitespace-pre-line text-sm text-text2">{it.text}</p>
                </div>
              </div>
          ))}

          {/* Schedule a Meeting CTA */}
          <Link
            href="/book-demo"
            className="flex items-start gap-4 rounded-card border border-gold/40 bg-card p-5 shadow-soft-1 transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-0.5 hover:shadow-soft-2 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-btn bg-gold/15 text-gold-text"><CalendarClock className="h-5 w-5" aria-hidden /></div>
            <div>
              <h3 className="text-base font-semibold text-text">Schedule a Meeting</h3>
              <p className="mt-0.5 text-sm text-text2">Book a free strategy call at a time that works for you.</p>
            </div>
          </Link>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${waNumber?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles('secondary', 'lg', 'w-full justify-start rounded-card px-5 py-4')}
          >
            <span className="text-[#128c7e]"><WaIcon /></span>
            Chat on WhatsApp — Instant Reply
          </a>
        </div>

        {/* Contact Form */}
        <form onSubmit={submit} className="rounded-panel border border-line bg-card p-6 shadow-soft-2 sm:p-8">
          <h2 className="mb-1 font-display text-card-title text-text">Send us a message</h2>
          <p className="mb-6 text-base text-text2">
            {"Fill the form and we'll get back within"} {s.averageResponseTime || '1 hour'}.
          </p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-firstName" className="mb-1.5 block text-sm font-medium text-text">First Name *</label>
                <input
                  id="contact-firstName"
                  name="firstName"
                  autoComplete="given-name"
                  className={FIELD}
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-lastName" className="mb-1.5 block text-sm font-medium text-text">Last Name *</label>
                <input
                  id="contact-lastName"
                  name="lastName"
                  autoComplete="family-name"
                  className={FIELD}
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={FIELD}
                  placeholder="john@company.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-text">Phone *</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={FIELD}
                  placeholder="+91 98765 43210"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-companyName" className="mb-1.5 block text-sm font-medium text-text">Company Name</label>
                <input
                  id="contact-companyName"
                  name="companyName"
                  autoComplete="organization"
                  className={FIELD}
                  placeholder="Optional"
                  value={form.companyName}
                  onChange={e => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-country" className="mb-1.5 block text-sm font-medium text-text">Country *</label>
                <select
                  id="contact-country"
                  name="country"
                  autoComplete="country-name"
                  className={FIELD}
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                >
                  {COUNTRY_OPTIONS.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-businessType" className="mb-1.5 block text-sm font-medium text-text">Business Type *</label>
                <select
                  id="contact-businessType"
                  name="businessType"
                  className={FIELD}
                  value={form.businessType}
                  onChange={e => setForm({ ...form, businessType: e.target.value })}
                >
                  {BUSINESS_TYPE_OPTIONS.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-service" className="mb-1.5 block text-sm font-medium text-text">Service Interested In</label>
                <select
                  id="contact-service"
                  name="service"
                  className={FIELD}
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                >
                  {['Custom Software Development', 'Website Development', 'GPS Tracking', 'Civil / Mechanical Work', 'Industrial Automation', 'Digital Marketing', 'Other'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-budget" className="mb-1.5 block text-sm font-medium text-text">Project Budget *</label>
                <select
                  id="contact-budget"
                  name="budget"
                  className={FIELD}
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                >
                  {BUDGET_OPTIONS.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-timeline" className="mb-1.5 block text-sm font-medium text-text">Project Timeline *</label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  className={FIELD}
                  value={form.timeline}
                  onChange={e => setForm({ ...form, timeline: e.target.value })}
                >
                  {TIMELINE_OPTIONS.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                className={`${FIELD} min-h-[120px] resize-y py-3`}
                placeholder="Tell us about your project..."
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className={buttonStyles('primary', 'lg', 'mt-5 w-full')}
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent — We will contact you soon' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p role="alert" className="mt-3 rounded-btn border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">{errorMsg}</p>
          )}
        </form>

      </div>
    </section>
  );
}
