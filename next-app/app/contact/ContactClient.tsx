'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';

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
    { Icon: Phone, title: 'Call Us', text: phoneText, bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
    { Icon: WaIcon, title: 'WhatsApp', text: `${waNumber}\n${s.whatsappSupportText || '24×7 support'}`, bg: 'linear-gradient(135deg,#25d366,#128c7e)' },
    { Icon: Mail, title: 'Email', text: emailText, bg: 'linear-gradient(135deg,#f97316,#ea580c)' },
    { Icon: MapPin, title: 'Head Office', text: officeText, bg: 'linear-gradient(135deg,#22c55e,#16a34a)' },
    { Icon: Clock, title: 'Business Hours', text: hoursText, bg: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
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
    <section className="section">
      <div className="container grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-4">
          {items.map(it => (
            <TiltCard key={it.title} className="card-base p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl grid place-items-center text-white shrink-0" style={{ background: it.bg }}>
                <it.Icon />
              </div>
              <div>
                <h4 className="font-bold">{it.title}</h4>
                <p className="text-[13px] text-text2 whitespace-pre-line">{it.text}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        <form onSubmit={submit} className="card-base p-8">
          <h3 className="text-xl font-bold mb-2">Send us a message</h3>
          <p className="text-text2 text-sm mb-5">Fill the form and we&apos;ll get back within {s.averageResponseTime || '1 hour'}.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input className="form-control" placeholder="First Name *" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <input className="form-control" placeholder="Last Name *" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="email" className="form-control" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="form-control" placeholder="Phone *" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <select className="form-control mb-4" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
            {['Custom Software Development', 'Website Development', 'GPS Tracking', 'Civil / Mechanical Work', 'Industrial Automation', 'Digital Marketing', 'Other'].map(o => <option key={o}>{o}</option>)}
          </select>
          <textarea className="form-control mb-4 min-h-[120px]" placeholder="Your Message *" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full justify-center">
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent — We will contact you soon' : 'Send Message'}
          </button>
          {status === 'error' && <p className="text-red-500 text-xs mt-2">Could not send. Please try WhatsApp.</p>}
        </form>
      </div>
    </section>
  );
}
