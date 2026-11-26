'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, Loader2, CheckCircle } from 'lucide-react';
import { trackEvent } from '@/components/analytics/track';

export function CallBackWidget() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('kvl:open-callback', onOpen);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('kvl:open-callback', onOpen); window.removeEventListener('keydown', onKey); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) return;
    setLoading(true);
    try {
      const r = await fetch('/api/call-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Customer', phone }),
      }).then(x => x.json());
      if (r.ok) { setCallInitiated(Boolean(r.callInitiated)); setDone(true); trackEvent('lead_submit', { source: 'callback-widget' }, r.leadId); }
      else alert(r.error || 'Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            role="dialog" aria-label="Call me back" className="fixed bottom-24 right-4 z-[110] w-[calc(100vw-32px)] rounded-2xl border border-tint bg-app2 p-4 shadow-2xl sm:right-6 sm:w-72"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-sm">Call Me Back</h4>
                <p className="text-[11px] text-text2">Our team will call you back within 1 hour.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-11 w-11 place-items-center"><X className="w-4 h-4 text-text2" /></button>
            </div>

            {done ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-sm">{callInitiated ? 'Your call is on its way' : 'Request received'}</p>
                <p className="text-[11px] text-text2 mt-1">
                  {callInitiated
                    ? 'Our team will call you shortly — please keep your phone nearby.'
                    : 'Our team has been notified and will call you back within 1 hour.'}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-2.5">
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="form-control w-full text-sm"
                />
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Mobile number *"
                  type="tel" required
                  className="form-control w-full text-sm"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold min-h-[44px] py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Calling...</> : <><Phone className="w-4 h-4" />Request a Call Back</>}
                </button>
                <p className="text-[10px] text-text2 text-center">Free service, no charge.</p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
