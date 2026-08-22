'use client';
import { useState } from 'react';
import { PhoneCall, Mail, Bot, Send, ChevronDown, Bolt, Shield, Clock, Headphones } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { TiltCard } from '@/components/shared/TiltCard';
import { FileUploader, UploadedFile } from '@/components/widgets/FileUploader';
import { useSession } from 'next-auth/react';
import { trackEvent } from '@/components/analytics/track';

const faqs = [
  { q: 'How fast can you deploy a software or website?', a: 'Most ready-made software products go live in 24–48 hours. Custom software takes 4–12 weeks depending on scope.' },
  { q: 'Do you provide installation and training?', a: 'Yes. Every product includes free installation, configuration, and 2 hours of online team training.' },
  { q: 'What is the pricing structure?', a: 'We offer annual subscription or one-time perpetual license. All pricing is transparent — no hidden fees.' },
  { q: 'Do you offer cloud and on-premise hosting?', a: 'Both. You can run our software on KVL Cloud, AWS/Azure/GCP, or on-premise servers.' },
  { q: 'What about data security and backups?', a: 'All data is encrypted at rest and in transit, with an NDA available on request before any project discussion. Automated daily backups with 30-day retention.' },
  { q: 'How does GPS tracking installation work?', a: 'Our technician visits, installs the GPS hardware (30 min/vehicle), configures the dashboard and trains your team.' },
  { q: 'Do you handle civil and mechanical work too?', a: 'Yes — dedicated civil engineering and mechanical divisions. From factory construction to fabrication.' },
  { q: 'What is your refund policy?', a: 'All software comes with 7-day free trial. If unhappy in first 30 days of subscription, 100% refund.' },
];

export default function SupportPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', product: 'ERP Software', priority: 'Medium', description: '' });
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ticket', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...form, priority: form.priority.toLowerCase(), attachments}) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setErrorMsg(d.error || 'Could not submit your ticket. Please try again or WhatsApp us.');
        setStatus('error');
        return;
      }
      setStatus('success');
      trackEvent('support_ticket_submit', { product: form.product, priority: form.priority });
      setForm({ name: '', email: '', product: 'ERP Software', priority: 'Medium', description: '' });
      setAttachments([]);
    } catch {
      setErrorMsg('Could not submit your ticket. Please try again or WhatsApp us.');
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero eyebrow="CUSTOMER SUPPORT" title="We're Here to" accent="Help — 24x7" description="Raise a ticket, browse FAQ, or chat with our AI assistant for instant help." breadcrumb="Support" />

      <section className="section">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { Icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>, name: 'WhatsApp', desc: 'Instant chat support', btn: 'Open Chat', href: `https://wa.me/${wa}`, c1: '#25d366', c2: '#128c7e' },
            { Icon: PhoneCall, name: 'Phone', desc: 'Call our helpline', btn: '+91 99420 00413', href: 'tel:+919942000413', c1: '#3b82f6', c2: '#1d4ed8' },
            { Icon: Mail, name: 'Email', desc: 'Reply within 1 hour', btn: 'Email Support', href: 'mailto:support@kvlbusinesssolutions.com', c1: '#f97316', c2: '#ea580c' },
            { Icon: Bot, name: 'AI Assistant', desc: 'Instant smart help', btn: 'Chat Now', href: '#', c1: '#8b5cf6', c2: '#6d28d9' },
          ].map(c => (
            <TiltCard key={c.name} className="card-base p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}><c.Icon /></div>
              <h5 className="font-bold">{c.name}</h5>
              <p className="text-xs text-text2 mb-3">{c.desc}</p>
              <a href={c.href} target="_blank" rel="noreferrer" className="btn text-xs" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`, color: '#fff' }}>{c.btn}</a>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container grid lg:grid-cols-2 gap-10">
          <div>
            <span className="eyebrow">RAISE A TICKET</span>
            <h2 className="text-3xl font-bold my-3">Submit a Support Request</h2>
            <p className="text-text2">Need help with software, GPS, or any service? Submit a ticket and our team will respond within 1 hour.</p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Bolt className="w-4 h-4 text-primary" /> Average response time: under 1 hour</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> 99.8% issue resolution rate</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Available Mon–Sat 9 AM – 8 PM</div>
              <div className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" /> 24x7 emergency line for paid clients</div>
            </div>
          </div>
          <form onSubmit={submit} className="card-base p-7">
            <h3 className="font-bold text-lg mb-4">New Support Ticket</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="ticket-name" className="sr-only">Name</label>
                <input id="ticket-name" name="name" autoComplete="name" className="form-control" placeholder="Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="ticket-email" className="sr-only">Email</label>
                <input id="ticket-email" name="email" type="email" autoComplete="email" className="form-control" placeholder="Email *" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <label htmlFor="ticket-product" className="sr-only">Product</label>
            <select id="ticket-product" name="product" className="form-control mb-3" value={form.product} onChange={e => setForm({...form, product: e.target.value})}>
              {['ERP Software','Website','GPS Tracking','HMS','School ERP','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
            <label htmlFor="ticket-priority" className="sr-only">Priority</label>
            <select id="ticket-priority" name="priority" className="form-control mb-3" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              {['Low','Medium','High','Critical'].map(o => <option key={o}>{o}</option>)}
            </select>
            <label htmlFor="ticket-description" className="sr-only">Describe your issue</label>
            <textarea id="ticket-description" name="description" className="form-control mb-3 min-h-[120px]" placeholder="Describe your issue *" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            {session?.user && (
              <div className="mb-4">
                <label className="text-xs text-text2 mb-2 block">Attachments (screenshots, PDFs — optional)</label>
                <FileUploader folder="kvl/tickets" value={attachments} onChange={setAttachments} maxSizeMB={5} />
              </div>
            )}
            <button disabled={status === 'sending'} className="btn btn-primary w-full justify-center"><Send className="w-4 h-4" /> {status === 'sending' ? 'Submitting...' : status === 'success' ? '✓ Ticket Created' : 'Submit Ticket'}</button>
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2 text-center">{errorMsg}</p>
            )}
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">FREQUENTLY ASKED</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Got Questions? We&apos;ve Got Answers</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="card-base group">
                <summary className="px-6 py-5 cursor-pointer font-semibold flex justify-between items-center list-none">
                  {f.q}
                  <ChevronDown className="w-4 h-4 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-text2 text-sm">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
