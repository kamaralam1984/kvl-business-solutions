'use client';
import { useState } from 'react';
import { PhoneCall, Mail, Bot, Send, ChevronDown, Bolt, Shield, Clock, Headphones } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Section, SectionHeading, Card, Panel, buttonStyles } from '@/components/ui';
import { FileUploader, UploadedFile } from '@/components/widgets/FileUploader';
import { useSession } from 'next-auth/react';
import { trackEvent } from '@/components/analytics/track';

const FIELD = 'w-full min-h-[44px] rounded-btn border border-line bg-card px-4 text-base text-text placeholder:text-text3 transition-shadow duration-base focus-visible:outline-none focus-visible:border-gold focus-visible:shadow-[var(--focus-ring)]';

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

      <Section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>, name: 'WhatsApp', desc: 'Instant chat support', btn: 'Open Chat', href: `https://wa.me/${wa}` },
            { Icon: PhoneCall, name: 'Phone', desc: 'Call our helpline', btn: '+91 99420 00413', href: 'tel:+919942000413' },
            { Icon: Mail, name: 'Email', desc: 'Reply within 1 hour', btn: 'Email Support', href: 'mailto:support@kvlbusinesssolutions.com' },
            { Icon: Bot, name: 'AI Assistant', desc: 'Instant smart help', btn: 'Chat Now', href: '#' },
          ].map(c => (
            <Card key={c.name} interactive className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-btn bg-gold/15 text-gold-text"><c.Icon /></div>
              <h3 className="font-display text-card-title text-text">{c.name}</h3>
              <p className="mb-4 mt-1 text-sm text-text2">{c.desc}</p>
              <a href={c.href} target="_blank" rel="noreferrer" className={buttonStyles('secondary', 'md', 'w-full')}>{c.btn}</a>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="alt" containerClassName="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="RAISE A TICKET" title="Submit a Support Request" description="Need help with software, GPS, or any service? Submit a ticket and our team will respond within 1 hour." />
          <div className="mt-6 space-y-3 text-base text-text2">
            <div className="flex items-center gap-3"><Bolt className="h-5 w-5 text-gold-text" aria-hidden /> Average response time: under 1 hour</div>
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-gold-text" aria-hidden /> 99.8% issue resolution rate</div>
            <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-gold-text" aria-hidden /> Available Mon–Sat 9 AM – 8 PM</div>
            <div className="flex items-center gap-3"><Headphones className="h-5 w-5 text-gold-text" aria-hidden /> 24x7 emergency line for paid clients</div>
          </div>
        </div>
        <Panel className="p-6 sm:p-8">
          <form onSubmit={submit}>
            <h3 className="mb-4 font-display text-card-title text-text">New Support Ticket</h3>
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ticket-name" className="sr-only">Name</label>
                <input id="ticket-name" name="name" autoComplete="name" className={FIELD} placeholder="Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="ticket-email" className="sr-only">Email</label>
                <input id="ticket-email" name="email" type="email" autoComplete="email" className={FIELD} placeholder="Email *" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <label htmlFor="ticket-product" className="sr-only">Product</label>
            <select id="ticket-product" name="product" className={`${FIELD} mb-3`} value={form.product} onChange={e => setForm({...form, product: e.target.value})}>
              {['ERP Software','Website','GPS Tracking','HMS','School ERP','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
            <label htmlFor="ticket-priority" className="sr-only">Priority</label>
            <select id="ticket-priority" name="priority" className={`${FIELD} mb-3`} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              {['Low','Medium','High','Critical'].map(o => <option key={o}>{o}</option>)}
            </select>
            <label htmlFor="ticket-description" className="sr-only">Describe your issue</label>
            <textarea id="ticket-description" name="description" className={`${FIELD} mb-3 min-h-[120px] resize-y py-3`} placeholder="Describe your issue *" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            {session?.user && (
              <div className="mb-4">
                <label className="mb-2 block text-sm text-text2">Attachments (screenshots, PDFs — optional)</label>
                <FileUploader folder="kvl/tickets" value={attachments} onChange={setAttachments} maxSizeMB={5} />
              </div>
            )}
            <button disabled={status === 'sending'} className={buttonStyles('primary', 'lg', 'w-full')}><Send className="h-4 w-4" aria-hidden /> {status === 'sending' ? 'Submitting...' : status === 'success' ? '✓ Ticket Created' : 'Submit Ticket'}</button>
            {status === 'error' && (
              <p role="alert" className="mt-3 rounded-btn border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">{errorMsg}</p>
            )}
          </form>
        </Panel>
      </Section>

      <Section>
        <SectionHeading align="center" eyebrow="FREQUENTLY ASKED" title="Got Questions? We've Got Answers" />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="group rounded-card border border-line bg-card shadow-soft-1">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-card px-6 py-5 font-semibold text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                {f.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-gold-text transition-transform duration-base group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <div className="px-6 pb-5 text-base text-text2">{f.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
