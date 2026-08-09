'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Keyboard/AT accessibility: Escape closes, focus moves into the dialog on
  // open and is restored to the previously-focused element on close.
  useEffect(() => {
    if (!show) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Save as lead
    const d = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Exit Intent Lead',
        email,
        phone: '0000000000',
        source: 'exit-popup',
        message: 'User submitted email via exit intent popup — wants a free consultation',
      }),
    }).then(r => r.json()).catch(() => ({}));
    trackEvent('lead_submit', { source: 'exit-popup' }, d.id);
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={e => e.target === e.currentTarget && dismiss()}
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden bg-bg2 border border-border/10"
            style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 80px rgba(0,0,0,0.45)' }}
          >
            <button onClick={dismiss} aria-label="Close"
              className="absolute top-5 right-5 z-10 grid place-items-center w-8 h-8 rounded-full text-text2 hover:text-text transition-colors"
              style={{ background: 'rgba(var(--text) / 0.06)' }}>
              <X className="w-4 h-4" />
            </button>

            {/* Subtle textured header — no stock gradient blobs */}
            <div className="relative px-7 pt-8 pb-6 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
                backgroundImage: 'radial-gradient(circle, rgba(var(--gold-rgb),0.4) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                opacity: 0.15,
                maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 0%, transparent 75%)',
              }} />
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="w-11 h-11 rounded-full grid place-items-center font-display font-bold text-[14px]"
                    style={{ background: 'rgba(var(--gold-rgb),0.10)', border: '1px solid rgba(var(--gold-rgb),0.28)', color: '#c8a870' }}>
                    KA
                  </div>
                </div>
                <span className="eyebrow eyebrow-dot justify-center mb-3">Before You Go</span>
                <h2 className="heading-md" style={{ color: 'rgb(var(--text))' }}>
                  Talk to a solution architect —<br className="hidden sm:block" /> not a sales rep.
                </h2>
                <p className="text-[13.5px] mt-3 leading-[1.7]" style={{ color: 'rgb(var(--text-2))' }}>
                  Leave your email and we&apos;ll set up a free 30-minute call to talk through what you&apos;re building.
                </p>
              </div>
            </div>

            <div className="divider-premium" />

            <div className="px-7 pt-6 pb-7">
              {submitted ? (
                <div className="text-center py-3">
                  <div className="w-12 h-12 rounded-full grid place-items-center mx-auto mb-3"
                    style={{ background: 'rgba(var(--gold-rgb),0.10)', border: '1px solid rgba(var(--gold-rgb),0.28)' }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#c8a870' }} />
                  </div>
                  <h3 className="font-display font-bold text-lg" style={{ color: 'rgb(var(--text))' }}>You&apos;re on the list</h3>
                  <p className="text-[13px] mt-1" style={{ color: 'rgb(var(--text-2))' }}>Someone from our team will reach out shortly.</p>
                </div>
              ) : (
                <>
                  <form onSubmit={submit} className="space-y-3">
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="form-control w-full"
                    />
                    <button type="submit"
                      className="w-full btn-gold-solid flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm">
                      Get My Free Consultation <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-[11.5px]" style={{ color: 'rgb(var(--text-3))' }}>
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#c8a870' }} />
                    No spam. One call from our team, nothing else.
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
