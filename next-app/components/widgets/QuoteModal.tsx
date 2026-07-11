'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Send, Globe, LaptopMinimal, Smartphone, Satellite, Sprout, Leaf, TreePine, Crown, Zap, Calendar, CalendarDays, Clock } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const types = [
  { label: 'Website', price: 25000, Icon: Globe },
  { label: 'Software / ERP', price: 80000, Icon: LaptopMinimal },
  { label: 'Mobile App', price: 60000, Icon: Smartphone },
  { label: 'GPS / IoT', price: 50000, Icon: Satellite },
];
const scopes = [
  { label: 'Basic', price: 0, Icon: Sprout },
  { label: 'Standard', price: 30000, Icon: Leaf },
  { label: 'Pro', price: 80000, Icon: TreePine },
  { label: 'Enterprise', price: 200000, Icon: Crown },
];
const timelines = [
  { label: 'ASAP (Rush)', price: 20000, Icon: Zap },
  { label: '1 Month', price: 0, Icon: Calendar },
  { label: '2-3 Months', price: -10000, Icon: CalendarDays },
  { label: 'Flexible', price: -20000, Icon: Clock },
];

export function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<{ type?: typeof types[0]; scope?: typeof scopes[0]; timeline?: typeof timelines[0] }>({});
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const h = () => setOpen(true);
    document.addEventListener('open-quote-modal', h);
    return () => document.removeEventListener('open-quote-modal', h);
  }, []);

  const base = (sel.type?.price || 0) + (sel.scope?.price || 0) + (sel.timeline?.price || 0);
  const low = Math.max(15000, base);
  const high = Math.round(low * 1.6);

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: sel.type?.label, scope: sel.scope?.label, timeline: sel.timeline?.label,
          estimateLow: low, estimateHigh: high, contact,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.error || 'Could not send your quote request. Please try again or WhatsApp us.');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not send your quote request. Please try again or WhatsApp us.');
    } finally { setSubmitting(false); }
  };

  const close = () => { setOpen(false); setTimeout(() => { setStep(0); setSel({}); setDone(false); setError(''); setContact({ name: '', email: '', phone: '' }); }, 300); };

  const Pane = ({ items, group }: { items: any[]; group: keyof typeof sel }) => (
    <div className="grid grid-cols-2 gap-2.5 mb-4">
      {items.map(it => (
        <button
          key={it.label}
          onClick={() => setSel(s => ({ ...s, [group]: it }))}
          className={`p-3.5 rounded-lg border text-center transition-all ${
            (sel as any)[group]?.label === it.label ? 'border-primary bg-primary/10' : 'border-tint surface-tint hover:border-primary'
          }`}
        >
          <it.Icon className="w-5 h-5 text-primary mx-auto mb-1" />
          <span className="text-[13px] font-semibold">{it.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="bg-app2 border border-tint rounded-2xl p-7 max-w-md w-full relative"
          >
            <button onClick={close} className="absolute top-3 right-4 text-text2"><X /></button>
            <h3 className="text-xl font-bold mb-1">Get Instant Quote</h3>
            <p className="text-text2 text-sm mb-4">Answer 3 quick questions for a personalized estimate.</p>

            <div className="flex gap-2 mb-5">
              {[0,1,2,3].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-primary' : 'surface2-tint'}`} />
              ))}
            </div>

            {!done ? (
              <>
                {step === 0 && <><h4 className="text-sm font-semibold mb-2.5">1. What are you building?</h4><Pane items={types} group="type" /></>}
                {step === 1 && <><h4 className="text-sm font-semibold mb-2.5">2. Project scope?</h4><Pane items={scopes} group="scope" /></>}
                {step === 2 && <><h4 className="text-sm font-semibold mb-2.5">3. Timeline?</h4><Pane items={timelines} group="timeline" /></>}
                {step === 3 && (
                  <div>
                    <div className="rounded-xl p-5 mb-3 text-white text-center" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                      <div className="text-xs opacity-80">Estimated investment</div>
                      <div className="text-2xl font-black my-1">{formatINR(low)} – {formatINR(high)}</div>
                      <div className="text-xs opacity-80">{sel.type?.label} · {sel.scope?.label} · {sel.timeline?.label}</div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="quote-name" className="sr-only">Your name</label>
                      <input id="quote-name" name="name" autoComplete="name" className="form-control" placeholder="Your name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                      <label htmlFor="quote-email" className="sr-only">Email</label>
                      <input id="quote-email" name="email" autoComplete="email" className="form-control" placeholder="Email" type="email" required value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
                      <label htmlFor="quote-phone" className="sr-only">Phone</label>
                      <input id="quote-phone" name="phone" autoComplete="tel" type="tel" className="form-control" placeholder="Phone" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-5">
                  <button onClick={() => setStep(s => Math.max(0, s - 1))} className="btn btn-ghost" disabled={step === 0}><ArrowLeft className="w-4 h-4" /> Back</button>
                  {step < 3 ? (
                    <button onClick={() => setStep(s => s + 1)} className="btn btn-primary" disabled={!(sel as any)[['type','scope','timeline'][step]]}>Next <ArrowRight className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={submit} className="btn btn-primary" disabled={submitting || !contact.email}><Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Submit'}</button>
                  )}
                </div>
                {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <h4 className="text-lg font-bold mb-2">Quote sent!</h4>
                <p className="text-text2 text-sm">A KVL expert will reach out within 1 hour with a detailed proposal.</p>
                <button onClick={close} className="btn btn-primary mt-5">Close</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const openQuoteModal = () => document.dispatchEvent(new Event('open-quote-modal'));
