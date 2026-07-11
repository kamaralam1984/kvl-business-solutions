'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CalendarClock } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { BUDGET_OPTIONS, TIMELINE_OPTIONS, BUSINESS_TYPE_OPTIONS, COUNTRY_OPTIONS } from '@/lib/lead-tier';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
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
      trackEvent('lead_submit', { source: 'contact-form', service: form.service });
      setStatus('success');
      router.push('/thank-you?type=contact');
    } catch {
      setErrorMsg('Could not send. Please try WhatsApp.');
      setStatus('error');
    }
  };

  return (
    <section className="section" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container grid lg:grid-cols-[1fr_1.4fr] gap-10">

        {/* Info Cards */}
        <div className="space-y-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="card-premium p-5 flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                  style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}
                >
                  <span className="text-text"><it.Icon /></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text">{it.title}</h4>
                  <p className="text-sm whitespace-pre-line mt-0.5 text-text2">{it.text}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Schedule a Meeting CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              href="/book-demo"
              className="card-premium p-5 flex gap-4 items-start transition-all hover:scale-[1.01]"
              style={{ borderColor: 'rgba(200,169,110,0.35)' }}
            >
              <div
                className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}
              >
                <span className="text-text"><CalendarClock className="w-5 h-5" /></span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">Schedule a Meeting</h4>
                <p className="text-sm mt-0.5 text-text2">Book a free strategy call at a time that works for you.</p>
              </div>
            </Link>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.a
            href={`https://wa.me/${waNumber?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3 w-full px-5 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}
          >
            <WaIcon />
            Chat on WhatsApp — Instant Reply
          </motion.a>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-premium p-8"
        >
          <h3 className="text-2xl font-bold mb-1 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>Send us a message</h3>
          <p className="text-sm mb-6 text-text2">
            {"Fill the form and we'll get back within"} {s.averageResponseTime || '1 hour'}.
          </p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-firstName" className="block text-xs font-medium mb-1.5 text-text">First Name *</label>
                <input
                  id="contact-firstName"
                  name="firstName"
                  autoComplete="given-name"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-lastName" className="block text-xs font-medium mb-1.5 text-text">Last Name *</label>
                <input
                  id="contact-lastName"
                  name="lastName"
                  autoComplete="family-name"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium mb-1.5 text-text">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="john@company.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-medium mb-1.5 text-text">Phone *</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="+91 98765 43210"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-companyName" className="block text-xs font-medium mb-1.5 text-text">Company Name</label>
                <input
                  id="contact-companyName"
                  name="companyName"
                  autoComplete="organization"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="Optional"
                  value={form.companyName}
                  onChange={e => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-country" className="block text-xs font-medium mb-1.5 text-text">Country *</label>
                <select
                  id="contact-country"
                  name="country"
                  autoComplete="country-name"
                  className="form-control"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                >
                  {COUNTRY_OPTIONS.map(o => (
                    <option key={o} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-businessType" className="block text-xs font-medium mb-1.5 text-text">Business Type *</label>
                <select
                  id="contact-businessType"
                  name="businessType"
                  className="form-control"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  value={form.businessType}
                  onChange={e => setForm({ ...form, businessType: e.target.value })}
                >
                  {BUSINESS_TYPE_OPTIONS.map(o => (
                    <option key={o} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-service" className="block text-xs font-medium mb-1.5 text-text">Service Interested In</label>
                <select
                  id="contact-service"
                  name="service"
                  className="form-control"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                >
                  {['Custom Software Development', 'Website Development', 'GPS Tracking', 'Civil / Mechanical Work', 'Industrial Automation', 'Digital Marketing', 'Other'].map(o => (
                    <option key={o} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-budget" className="block text-xs font-medium mb-1.5 text-text">Project Budget *</label>
                <select
                  id="contact-budget"
                  name="budget"
                  className="form-control"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                >
                  {BUDGET_OPTIONS.map(o => (
                    <option key={o} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-timeline" className="block text-xs font-medium mb-1.5 text-text">Project Timeline *</label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  className="form-control"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  value={form.timeline}
                  onChange={e => setForm({ ...form, timeline: e.target.value })}
                >
                  {TIMELINE_OPTIONS.map(o => (
                    <option key={o} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium mb-1.5 text-text">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                className="form-control resize-none"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', minHeight: '120px' }}
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
            className="btn-primary w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-5 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent — We will contact you soon' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p className="text-red-400 text-xs mt-2 text-center">{errorMsg}</p>
          )}
        </motion.form>

      </div>
    </section>
  );
}
