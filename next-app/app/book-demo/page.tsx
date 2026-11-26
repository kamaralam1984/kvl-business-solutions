'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { softwareProducts } from '@/lib/data/software';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { Calendar, CheckCircle2, Clock, Video, Phone, Send } from 'lucide-react';
import { Panel, Card, buttonStyles } from '@/components/ui';

const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || '';

export default function BookDemoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    product: 'General consultation', preferredDate: '', preferredTime: '10:00', notes: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');
  const [bookDemoEnabled, setBookDemoEnabled] = useState(true);
  const [featuresChecked, setFeaturesChecked] = useState(false);

  useEffect(() => {
    fetch('/api/site-features').then(r => r.json()).then(d => setBookDemoEnabled(d.bookDemo !== false)).catch(() => {}).finally(() => setFeaturesChecked(true));
  }, []);

  // Checked client-side after mount (this page is statically generated), so
  // briefly show nothing rather than flashing the full booking form before
  // an admin-disabled state has had a chance to load.
  if (featuresChecked && !bookDemoEnabled) {
    return (
      <div className="min-h-[70vh] grid place-items-center p-6 text-center" style={{ background: 'rgb(var(--bg))' }}>
        <div>
          <h1 className="text-2xl font-extrabold mb-3">Demo booking is temporarily unavailable</h1>
          <p className="text-text2 max-w-md mx-auto mb-6">We&apos;re not scheduling new demo calls through this page right now — reach out directly and we&apos;ll help you from there.</p>
          <a href="https://wa.me/919942000413" target="_blank" rel="noreferrer" className={buttonStyles()}>
            WhatsApp us
          </a>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      trackEvent('booking_submit', { product: form.product }, d.id);
      setState('success');
      router.push('/thank-you?type=booking');
    } catch (e: any) { setState('error'); setErr(e.message); }
  };

  return (
    <div style={{ background: 'rgb(var(--bg))' }}>

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-24">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            BOOK A DEMO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight"
            style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}
          >
            Book Your Free Demo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'rgba(var(--text) / 0.55)' }}
          >
            {"Pick a slot that works for you. We'll walk you through the product, answer questions, and share a custom quote."}
          </motion.p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Main content */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 max-w-5xl mx-auto">

            {/* Form / Cal / Success */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {CAL_USERNAME ? (
                <>
                  <Script src="https://cal.com/embed.js" />
                  <Panel className="overflow-hidden">
                    <iframe title="Book a demo" src={`https://cal.com/${CAL_USERNAME}?embed=true`} className="h-[600px] w-full border-0" />
                  </Panel>
                </>
              ) : state === 'success' ? (
                <Panel className="p-12 text-center">
                  <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-gold/10">
                    <CheckCircle2 aria-hidden className="h-10 w-10 text-gold-text" />
                  </div>
                  <h2 className="mb-3 font-display text-section text-text">Booking received!</h2>
                  <p className="mb-7 text-sm text-text2">Our team will confirm a slot and email you within 1 hour.</p>
                  <a
                    href="https://wa.me/919942000413"
                    target="_blank"
                    rel="noreferrer"
                    className={buttonStyles()}
                  >
                    Need it sooner? WhatsApp us
                  </a>
                </Panel>
              ) : (
                <Panel className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="grid h-10 w-10 place-items-center rounded-btn border border-gold/30 bg-gold/10">
                      <Calendar aria-hidden className="h-5 w-5 text-gold-text" />
                    </div>
                    <h2 className="text-xl font-bold text-text">Schedule your demo</h2>
                  </div>

                  {/* Progress steps */}
                  <div className="flex gap-2 mb-6">
                    {['Your Info', 'Product', 'Date & Time'].map((step, i) => (
                      <div key={step} className="flex-1 text-center">
                        <div
                          className="h-1 rounded-full mb-1.5"
                          style={{ background: i === 0 ? '#c8a96e' : 'rgba(var(--border) / 0.08)' }}
                        />
                        <span className="text-[10px] text-text2">{step}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bookdemo-name" className="block text-xs font-medium mb-1.5 text-text">Full name *</label>
                        <input
                          id="bookdemo-name"
                          name="name"
                          autoComplete="name"
                          className="form-control"
                          placeholder="Your name"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="bookdemo-email" className="block text-xs font-medium mb-1.5 text-text">Email *</label>
                        <input
                          id="bookdemo-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="form-control"
                          placeholder="you@company.com"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bookdemo-phone" className="block text-xs font-medium mb-1.5 text-text">Phone *</label>
                        <input
                          id="bookdemo-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          className="form-control"
                          placeholder="+91 98765 43210"
                          required
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="bookdemo-company" className="block text-xs font-medium mb-1.5 text-text">Company</label>
                        <input
                          id="bookdemo-company"
                          name="company"
                          autoComplete="organization"
                          className="form-control"
                          placeholder="Optional"
                          value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bookdemo-product" className="block text-xs font-medium mb-1.5 text-text">Product / Service</label>
                      <select
                        id="bookdemo-product"
                        name="product"
                        className="form-control"
                        value={form.product}
                        onChange={e => setForm({ ...form, product: e.target.value })}
                      >
                        <option style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>General consultation</option>
                        {softwareProducts.map(p => (
                          <option key={p.slug} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bookdemo-date" className="block text-xs font-medium mb-1.5 text-text">Preferred Date</label>
                        <input
                          id="bookdemo-date"
                          name="preferredDate"
                          type="date"
                          className="form-control"
                          value={form.preferredDate}
                          onChange={e => setForm({ ...form, preferredDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="bookdemo-time" className="block text-xs font-medium mb-1.5 text-text">Preferred Time</label>
                        <input
                          id="bookdemo-time"
                          name="preferredTime"
                          type="time"
                          className="form-control"
                          value={form.preferredTime}
                          onChange={e => setForm({ ...form, preferredTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bookdemo-notes" className="block text-xs font-medium mb-1.5 text-text">Questions or requirements</label>
                      <textarea
                        id="bookdemo-notes"
                        name="notes"
                        className="form-control resize-none"
                        style={{ minHeight: '80px' }}
                        placeholder="Anything specific you'd like to cover?"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                    {err && <p id="bookdemo-error" role="alert" className="text-sm text-red-500">{err}</p>}
                    <button
                      disabled={state === 'sending'}
                      className={buttonStyles('primary', 'md', 'w-full')}
                    >
                      <Send aria-hidden className="h-4 w-4" />
                      {state === 'sending' ? 'Booking…' : 'Request Demo'}
                    </button>
                    <p className="text-center text-xs text-text2">
                      {"We'll confirm by email + WhatsApp within 1 hour."}
                    </p>
                  </form>
                </Panel>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-5"
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="eyebrow">WHAT TO EXPECT</span>
                </div>
                <ul className="space-y-4 text-sm">
                  {[
                    { Icon: Clock, label: '30 min', desc: 'walkthrough of your chosen product' },
                    { Icon: Video, label: 'Live screenshare', desc: '+ Q&A with a product expert' },
                    { Icon: CheckCircle2, label: 'Custom quote', desc: '+ 7-day free trial sent after demo' },
                    { Icon: Phone, label: 'No pressure', desc: '— we only sell if it fits' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-btn border border-gold/30 bg-gold/10">
                        <item.Icon aria-hidden className="h-4 w-4 text-gold-text" />
                      </div>
                      <span className="text-text2">
                        <span className="font-semibold text-text">{item.label}</span> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="mb-1 text-base font-semibold text-text">Prefer to talk now?</h3>
                <p className="mb-4 text-sm text-text2">Call or WhatsApp our sales team:</p>
                <a
                  href="tel:+919942000413"
                  onClick={() => trackEvent('call_click', { widget: 'book-demo-sidebar' })}
                  className={buttonStyles('secondary', 'md', 'mb-3 w-full')}
                >
                  <Phone aria-hidden className="h-4 w-4" /> +91 99420 00413
                </a>
                <a
                  href="https://wa.me/919942000413"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { widget: 'book-demo-sidebar' })}
                  className={buttonStyles('primary', 'md', 'w-full')}
                >
                  WhatsApp
                </a>
              </Card>
            </motion.aside>

          </div>
        </div>
      </section>

    </div>
  );
}
