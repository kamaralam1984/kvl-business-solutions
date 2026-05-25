'use client';
import { useState } from 'react';
import Script from 'next/script';
import { PageHero } from '@/components/shared/PageHero';
import { softwareProducts } from '@/lib/data/software';
import { Calendar, CheckCircle2, Clock, Video, Phone, Send } from 'lucide-react';

const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || ''; // e.g., "kvl-sales/30min"

export default function BookDemoPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    product: 'General consultation', preferredDate: '', preferredTime: '10:00', notes: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      setState('success');
    } catch (e: any) { setState('error'); setErr(e.message); }
  };

  return (
    <>
      <PageHero
        eyebrow="BOOK A DEMO"
        title="See KVL in action"
        accent="— 30 minutes"
        description="Pick a slot that works for you. We'll walk you through the product, answer questions, and share a custom quote."
        breadcrumb="Book Demo"
      />

      <section className="section">
        <div className="container grid lg:grid-cols-[2fr_1fr] gap-8 max-w-6xl">
          <div>
            {CAL_USERNAME ? (
              <>
                <Script src="https://app.cal.com/embed/embed.js" strategy="afterInteractive" />
                <div className="card-base p-2 min-h-[640px]">
                  <iframe src={`https://cal.com/${CAL_USERNAME}?embed=true&theme=auto`} width="100%" height="640" frameBorder={0} className="rounded-xl" />
                </div>
              </>
            ) : state === 'success' ? (
              <div className="card-base p-10 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                <h2 className="text-2xl font-extrabold mt-3">Booking received!</h2>
                <p className="text-text2 mt-2">Our team will confirm a slot and email you within 2 business hours.</p>
                <a href="https://wa.me/919942000413" target="_blank" rel="noreferrer" className="btn btn-primary mt-5 inline-flex">Need it sooner? WhatsApp us</a>
              </div>
            ) : (
              <form onSubmit={submit} className="card-base p-7 space-y-3">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Schedule your demo</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="form-control" placeholder="Full name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input type="email" className="form-control" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input className="form-control" placeholder="Phone / WhatsApp *" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <input className="form-control" placeholder="Company name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <select className="form-control" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                  <option>General consultation</option>
                  {softwareProducts.map(p => <option key={p.slug} value={p.name}>{p.name}</option>)}
                  <option>Custom development</option>
                  <option>GPS / Hardware</option>
                  <option>Civil / Automation</option>
                </select>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} />
                  <select className="form-control" value={form.preferredTime} onChange={e => setForm({ ...form, preferredTime: e.target.value })}>
                    {['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <textarea className="form-control" rows={3} placeholder="Anything specific you'd like us to cover? (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                {err && <p className="text-red-500 text-xs">{err}</p>}
                <button disabled={state === 'sending'} className="btn btn-primary w-full justify-center"><Send className="w-4 h-4" /> {state === 'sending' ? 'Booking…' : 'Request Demo'}</button>
                <p className="text-[10px] text-text2 text-center">We'll confirm by email + WhatsApp within 2 business hours.</p>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card-base p-5">
              <h3 className="font-bold mb-3">What to expect</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-start"><Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span><b>30 min</b> walkthrough of your chosen product</span></li>
                <li className="flex gap-2 items-start"><Video className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span><b>Live screenshare</b> + Q&amp;A with a product expert</span></li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span><b>Custom quote</b> + 7-day free trial sent after demo</span></li>
                <li className="flex gap-2 items-start"><Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span><b>No pressure</b> — we only sell if it fits</span></li>
              </ul>
            </div>
            <div className="card-base p-5 surface-tint">
              <h3 className="font-bold mb-2 text-sm">Prefer to talk now?</h3>
              <p className="text-text2 text-xs mb-3">Call or WhatsApp our sales team:</p>
              <a href="tel:+919942000413" className="btn btn-ghost w-full justify-center text-sm mb-2"><Phone className="w-4 h-4" /> +91 99420 00413</a>
              <a href="https://wa.me/919942000413" target="_blank" rel="noreferrer" className="btn w-full justify-center text-sm text-white" style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>WhatsApp</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
