'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, Loader2, CheckCircle } from 'lucide-react';

export function CallBackWidget() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
      if (r.ok) setDone(true);
      else alert(r.error || 'Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Floating Call Me Back button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-colors"
        aria-label="Call Me Back"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Call Me Back</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-14 right-0 w-72 bg-surface rounded-2xl shadow-2xl border border-tint p-4 z-[110]"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-sm">📞 Call Me Back</h4>
                <p className="text-[11px] text-text2">Priya 30 seconds mein call karegi!</p>
              </div>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-text2" /></button>
            </div>

            {done ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-sm">Call aa rahi hai!</p>
                <p className="text-[11px] text-text2 mt-1">Priya abhi aapko call karengi — phone ready rakhein.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-2.5">
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Aapka naam (optional)"
                  className="form-control w-full text-sm"
                />
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Mobile number *"
                  type="tel" required
                  className="form-control w-full text-sm"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Calling...</> : <><Phone className="w-4 h-4" />Abhi Call Karein!</>}
                </button>
                <p className="text-[10px] text-text2 text-center">Free service — koi charge nahi</p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
