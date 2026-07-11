'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // Don't show if already shown this session
    if (sessionStorage.getItem('exit-popup-shown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !dismissed) {
        setShow(true);
        sessionStorage.setItem('exit-popup-shown', '1');
      }
    };

    // Also show on mobile after 45 seconds (no mouse leave on mobile)
    const mobileTimer = setTimeout(() => {
      if (!dismissed && !sessionStorage.getItem('exit-popup-shown')) {
        setShow(true);
        sessionStorage.setItem('exit-popup-shown', '1');
      }
    }, 45_000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [dismissed]);

  const dismiss = () => { setShow(false); setDismissed(true); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Save as lead
    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Exit Intent Lead',
        email,
        phone: '0000000000',
        source: 'exit-popup',
        message: 'User submitted email via exit intent popup — wants a free consultation',
      }),
    }).catch(() => {});
    trackEvent('lead_submit', { source: 'exit-popup' });
    setSubmitted(true);
    setTimeout(dismiss, 3000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={e => e.target === e.currentTarget && dismiss()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-app2 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            <button onClick={dismiss} className="absolute top-4 right-4 z-10 text-text2 hover:text-text bg-tint rounded-full p-1">
              <X className="w-4 h-4" />
            </button>

            {/* Top banner */}
            <div className="bg-gradient-to-br from-primary to-blue-700 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute w-20 h-20 rounded-full bg-white"
                    style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: 'translate(-50%,-50%)' }} />
                ))}
              </div>
              <div className="relative">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Before You Go</p>
                <h2 className="text-2xl font-extrabold">Get a Free Consultation</h2>
                <p className="text-sm opacity-80 mt-1">Leave your email and a solution architect will reach out.</p>
              </div>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 grid place-items-center mx-auto mb-3">
                    <Zap className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg">Thank you</h3>
                  <p className="text-text2 text-sm mt-1">Our team will be in touch shortly.</p>
                </div>
              ) : (
                <>
                  <p className="text-text2 text-sm text-center mb-4">
                    Share your email and we'll set up a <strong>free strategy call</strong> to talk through your project — no pressure, no obligation.
                  </p>
                  <form onSubmit={submit} className="space-y-3">
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="form-control w-full"
                    />
                    <button type="submit"
                      className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm">
                      Get My Free Consultation <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[11px] text-text2 text-center mt-3">No spam — just one call from our team.</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
