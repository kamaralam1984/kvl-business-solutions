'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
  </svg>
);

export function ContactClient({ settings }: { settings: any }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', service: 'Custom Software Development', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone, service: form.service, message: form.message }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', phone: '', service: 'Custom Software Development', message: '' });
    } catch { setStatus('error'); }
  };

  return (
    <section className="section" style={{ background: '#0a0a0a' }}>
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
                  <span style={{ color: '#f5f5f0' }}><it.Icon /></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#f5f5f0' }}>{it.title}</h4>
                  <p className="text-sm whitespace-pre-line mt-0.5" style={{ color: '#888' }}>{it.text}</p>
                </div>
              </div>
            </motion.div>
          ))}

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
          <h3 className="text-2xl font-bold mb-1" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>Send us a message</h3>
          <p className="text-sm mb-6" style={{ color: '#888' }}>
            {"Fill the form and we'll get back within"} {s.averageResponseTime || '1 hour'}.
          </p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>First Name *</label>
                <input
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Last Name *</label>
                <input
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Email *</label>
                <input
                  type="email"
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="john@company.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Phone *</label>
                <input
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="+91 98765 43210"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Service Interested In</label>
              <select
                className="form-control"
                style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', color: '#888' }}
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
              >
                {['Custom Software Development', 'Website Development', 'GPS Tracking', 'Civil / Mechanical Work', 'Industrial Automation', 'Digital Marketing', 'Other'].map(o => (
                  <option key={o} style={{ background: '#0a0a0a' }}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Message *</label>
              <textarea
                className="form-control resize-none"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0', minHeight: '120px' }}
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
            <p className="text-red-400 text-xs mt-2 text-center">Could not send. Please try WhatsApp.</p>
          )}
        </motion.form>

      </div>
    </section>
  );
}
