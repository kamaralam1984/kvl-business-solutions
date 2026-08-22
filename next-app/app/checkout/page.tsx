'use client';
import { useEffect, useState, Suspense } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Software } from '@/lib/data/software';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { Check, ShieldCheck, CreditCard, Lock, Loader2, Mail, Phone, IndianRupee } from 'lucide-react';

const MIN_ADVANCE = 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CheckoutInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const productSlug = sp.get('product') || '';
  const hosting = (sp.get('host') as 'cloud' | 'on-premise') || 'cloud';
  const [product, setProduct] = useState<Software | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [rzpReady, setRzpReady] = useState(false);
  const [rzpBlocked, setRzpBlocked] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [confirming, setConfirming] = useState(false);

  // Payment comes first, account creation after (see /checkout/success) — a
  // guest just needs an email + phone to receive the license key and pay.
  // Logged-in visitors skip this entirely and pay with their session details.
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const isGuest = status === 'unauthenticated';
  const guestDetailsValid = EMAIL_RE.test(guestEmail) && guestPhone.replace(/\D/g, '').length >= 10;

  // Live product description/features — fetched instead of imported statically
  // so an Admin → Products edit is reflected immediately.
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProduct((d.products || []).find((p: Software) => p.slug === productSlug) || null))
      .catch(() => setProduct(null))
      .finally(() => setProductLoading(false));
  }, [productSlug]);

  useEffect(() => {
    if (!product) return;
    trackEvent('begin_checkout', { content_ids: [product.slug], content_name: product.name, currency: 'INR' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  const amountValid = Number(advanceAmount) >= MIN_ADVANCE;
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  const pay = async () => {
    if (!amountValid) { setErr(`Enter an advance amount of at least ₹${MIN_ADVANCE}.`); return; }
    if (isGuest && !guestDetailsValid) { setErr('Enter a valid email and phone number first.'); return; }
    if (!rzpReady || !(window as any).Razorpay) { setErr('Payment gateway is still loading — please wait a moment and try again. If this persists, disable any ad-blocker and reload the page.'); return; }
    setLoading(true); setErr('');

    // create-order can fail on a genuine network drop before any HTTP
    // response comes back — retried once so a single dropped packet doesn't
    // force the customer to re-fill the form and try again from scratch.
    let data: any;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('/api/payments/create-order', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productSlug, hosting, amount: Number(advanceAmount),
            ...(isGuest ? { guestEmail, guestPhone } : {}),
          }),
        });
        data = await res.json();
        break;
      } catch {
        if (attempt === 1) { setErr('Could not reach the server — check your connection and try again.'); setLoading(false); return; }
        await sleep(1000);
      }
    }
    if (!data.ok) { setErr(data.error || 'Failed to start checkout'); setLoading(false); return; }

    try {
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'KVL Business Solutions',
        description: data.productName,
        order_id: data.razorpayOrderId,
        prefill: {
          email: session?.user?.email || guestEmail,
          name: session?.user?.name,
          contact: guestPhone || undefined,
        },
        theme: { color: '#2563eb' },
        handler: async (resp: any) => {
          setConfirming(true);
          const paymentId = resp.razorpay_payment_id;
          let verified: { orderId: string } | null = null;
          let fatalError = '';

          // Razorpay only calls this handler after a real successful charge —
          // so /verify failing here is never treated as "payment failed".
          // Up to 3 attempts with backoff absorb a network blip right after
          // the charge; a 400/404 response means retrying won't help (bad
          // signature or a genuinely missing order), so we stop immediately
          // instead of hammering it.
          for (let attempt = 0; attempt < 3 && !verified; attempt++) {
            try {
              const r = await fetch('/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resp) });
              const vd = await r.json();
              if (vd.ok) { verified = { orderId: vd.orderId }; break; }
              if (r.status === 400 || r.status === 404) { fatalError = vd.error || 'Payment verification failed'; break; }
            } catch { /* transient network error — retry */ }
            if (attempt < 2) await sleep(1000 * 2 ** attempt);
          }

          // /verify never came back cleanly for a non-fatal (network) reason.
          // Fall back to polling the order's status — the payment.captured
          // webhook confirms the same order independently of this browser,
          // usually within a couple of seconds, so we can still land the
          // customer on the real success page instead of a dead end.
          if (!verified && !fatalError) {
            for (let i = 0; i < 6 && !verified; i++) {
              await sleep(2000);
              try {
                const r = await fetch(`/api/payments/status?razorpayOrderId=${encodeURIComponent(data.razorpayOrderId)}`);
                const sd = await r.json();
                if (sd.ok && sd.status === 'paid') verified = { orderId: sd.orderId };
                else if (sd.ok && sd.status === 'failed') { fatalError = 'Payment was not completed.'; break; }
              } catch { /* keep polling */ }
            }
          }

          setConfirming(false);
          if (verified) {
            trackEvent('purchase', { value: data.amount / 100, currency: data.currency || 'INR', transaction_id: verified.orderId, product: data.productName }, verified.orderId);
            // Logged-in buyers go straight to their dashboard. Guests paid
            // first — now's when we offer to turn that into an account.
            if (session?.user?.email) router.push(`/dashboard?success=${verified.orderId}`);
            else router.push(`/checkout/success?order=${verified.orderId}&email=${encodeURIComponent(guestEmail)}&product=${encodeURIComponent(productSlug)}`);
            return;
          }
          setLoading(false);
          setErr(fatalError
            ? `${fatalError} If any amount was deducted, do NOT pay again — contact support with payment ID ${paymentId} and we'll sort it out.`
            : `Your payment likely went through, but we're having trouble confirming it here. Do NOT pay again — check your email shortly, or contact support with payment ID ${paymentId}.`);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', (resp: any) => {
        setErr(resp.error?.description || 'Payment failed. Please try again or use a different payment method.');
        setLoading(false);
        fetch('/api/payments/mark-failed', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: resp.error?.metadata?.order_id || data.razorpayOrderId,
            code: resp.error?.code, description: resp.error?.description, reason: resp.error?.reason,
          }),
        }).catch(() => {});
      });
      rzp.open();
    } catch (e: any) {
      setErr(e.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  // Razorpay needs a known amount before it can open, and the advance amount
  // is chosen by the customer — so unlike a fixed-price checkout, there's no
  // amount to auto-open with on page load. Entering it and pressing "Pay" is
  // the one required step; Razorpay opens immediately after that.

  if (productLoading) return <div className="container py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-text2" /></div>;
  if (!product) return <div className="container py-20 text-center">Invalid product.</div>;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRzpReady(true)} onError={() => setRzpBlocked(true)} />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <div className="card-base p-7">
            <h2 className="text-xl font-bold mb-3">{product.name}</h2>
            <p className="text-text2 text-sm mb-5">{product.description}</p>
            <h3 className="font-bold mb-2">What you get:</h3>
            <ul className="space-y-1.5 text-sm">
              {product.features.map(f => <li key={f} className="flex gap-2 items-center"><Check className="w-4 h-4 text-green-500" /> {f}</li>)}
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-green-500" /> Free installation &amp; setup</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-green-500" /> 1-year unlimited support</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-green-500" /> {hosting === 'cloud' ? 'Hosted on KVL Cloud' : 'On-premise installation'}</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-green-500" /> 30-day money-back guarantee</li>
            </ul>
          </div>
          <div className="card-base p-6">
            <h3 className="font-bold mb-1">Advance Payment</h3>
            <p className="text-text2 text-xs mb-3">Pay whatever advance amount you&apos;d like now to get started — we&apos;ll discuss the rest on a call. {hosting === 'cloud' ? '☁ Cloud' : '🖥 On-Premise'} hosting.</p>
            <div className="relative mb-4">
              <label htmlFor="checkout-advance-amount" className="sr-only">Advance payment amount</label>
              <IndianRupee className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
              <input
                id="checkout-advance-amount"
                type="number" min={MIN_ADVANCE} step={1}
                value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)}
                placeholder={`Minimum ₹${MIN_ADVANCE}`}
                className="form-control pl-9 text-lg font-bold"
              />
            </div>

            {isGuest && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-text2">We&apos;ll send your license key here — no account needed to pay.</p>
                <div className="relative">
                  <label htmlFor="checkout-guest-email" className="sr-only">Email address</label>
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
                  <input
                    id="checkout-guest-email"
                    type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                    placeholder="you@company.com" autoComplete="email"
                    className="form-control pl-9 text-sm"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="checkout-guest-phone" className="sr-only">Mobile number</label>
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
                  <input
                    id="checkout-guest-phone"
                    type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210" autoComplete="tel"
                    className="form-control pl-9 text-sm"
                  />
                </div>
              </div>
            )}

            <button disabled={loading || !rzpReady || !amountValid || (isGuest && !guestDetailsValid)} onClick={() => pay()} className="btn btn-primary w-full justify-center">
              <CreditCard className="w-4 h-4" /> {confirming ? 'Confirming your payment...' : loading ? 'Opening Razorpay...' : !rzpReady ? 'Loading payment gateway...' : 'Advance Payment'}
            </button>
            {confirming && <p className="text-text2 text-xs mt-2">Please don&apos;t close this tab — confirming your payment with the bank.</p>}
            {rzpBlocked && <p className="text-red-500 text-xs mt-2">Couldn&apos;t load the payment gateway — please disable any ad-blocker for this site and reload the page.</p>}
            {err && <p className="text-red-500 text-xs mt-2">{err}</p>}
            <div className="mt-4 pt-4 border-t border-tint space-y-1.5 text-[11px] text-text2">
              <div className="flex gap-2 items-center"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> 256-bit SSL encryption</div>
              <div className="flex gap-2 items-center"><Lock className="w-3.5 h-3.5 text-green-500" /> Secure Razorpay payment</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="container py-20 text-center">Loading…</div>}><CheckoutInner /></Suspense>;
}
