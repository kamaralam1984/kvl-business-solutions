'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Software } from '@/lib/data/software';
import { formatINR } from '@/lib/utils';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { Check, ShieldCheck, CreditCard, Lock, Tag, X, Loader2, Mail, Phone } from 'lucide-react';

const GST_RATE = 18;
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

  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponErr, setCouponErr] = useState('');

  // Payment comes first, account creation after (see /checkout/success) — a
  // guest just needs an email + phone to receive the license key and pay.
  // Logged-in visitors skip this entirely and pay with their session details.
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const isGuest = status === 'unauthenticated';
  const guestDetailsValid = EMAIL_RE.test(guestEmail) && guestPhone.replace(/\D/g, '').length >= 10;

  // Live price/description — fetched instead of imported statically so an
  // Admin → Products edit shows the same numbers the customer is charged.
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProduct((d.products || []).find((p: Software) => p.slug === productSlug) || null))
      .finally(() => setProductLoading(false));
  }, [productSlug]);

  const pay = async (couponCodeOverride?: string) => {
    if (isGuest && !guestDetailsValid) { setErr('Enter a valid email and phone number first.'); return; }
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug, hosting, couponCode: couponCodeOverride ?? applied?.code,
          ...(isGuest ? { guestEmail, guestPhone } : {}),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

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
          const verify = await fetch('/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resp) });
          const vd = await verify.json();
          if (!vd.ok) { setErr('Payment verification failed. Please contact support.'); return; }
          trackEvent('purchase', { value: data.amount / 100, currency: data.currency || 'INR', transaction_id: vd.orderId, product: data.productName });
          // Logged-in buyers go straight to their dashboard. Guests paid
          // first — now's when we offer to turn that into an account.
          if (session?.user?.email) router.push(`/dashboard?success=${vd.orderId}`);
          else router.push(`/checkout/success?order=${vd.orderId}&email=${encodeURIComponent(guestEmail)}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (e: any) {
      setErr(e.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  // Order Now → Razorpay should open immediately for a logged-in visitor, not
  // wait for a second "Pay Now" click. Guests can't auto-open — Razorpay needs
  // an email/phone to prefill, so they fill the short form below first and
  // press "Pay Now" themselves. This page still renders behind the modal
  // (order summary, GST breakdown, coupon field) as a fallback either way.
  const autoTriedRef = useRef(false);
  useEffect(() => {
    if (autoTriedRef.current) return;
    if (status !== 'authenticated' || !product || !rzpReady) return;
    autoTriedRef.current = true;
    pay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, product, rzpReady]);

  if (productLoading) return <div className="container py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-text2" /></div>;
  if (!product) return <div className="container py-20 text-center">Invalid product.</div>;
  const base = Math.round(product.price * (hosting === 'on-premise' ? 1.5 : 1));
  const subtotal = base - (applied?.discount || 0);
  const gst = Math.round((subtotal * GST_RATE) / 100);
  const total = subtotal + gst;

  const applyCoupon = async () => {
    setCouponErr(''); setCouponLoading(true);
    try {
      const r = await fetch('/api/coupon/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, productSlug, hosting }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Invalid coupon');
      setApplied({ code: d.code, discount: d.discount });
      setCode('');
    } catch (e: any) { setCouponErr(e.message); }
    finally { setCouponLoading(false); }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRzpReady(true)} />
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
            <div className="space-y-2 text-sm border-b border-tint pb-3 mb-3">
              <div className="flex justify-between"><span className="text-text2">Subtotal</span><span>{formatINR(base)}</span></div>
              {applied && (
                <div className="flex justify-between text-green-500">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {applied.code}
                    <button onClick={() => setApplied(null)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                  <span>−{formatINR(applied.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs"><span className="text-text2">GST ({GST_RATE}%)</span><span>{formatINR(gst)}</span></div>
            </div>
            <div className="text-xs uppercase text-text2 tracking-wider">Total</div>
            <div className="text-3xl font-extrabold text-primary my-1">{formatINR(total)}</div>
            <div className="text-xs text-text2 mb-4">{product.unit} · {hosting === 'cloud' ? '☁ Cloud' : '🖥 On-Premise'}</div>

            {!applied && (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="form-control text-xs font-mono uppercase flex-1"
                  />
                  <button onClick={applyCoupon} disabled={!code || couponLoading} className="btn btn-ghost text-xs">
                    {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponErr && <p className="text-red-500 text-[11px] mt-1">{couponErr}</p>}
              </div>
            )}

            {isGuest && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-text2">We&apos;ll send your license key here — no account needed to pay.</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
                  <input
                    type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                    placeholder="you@company.com" autoComplete="email"
                    className="form-control pl-9 text-sm"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
                  <input
                    type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210" autoComplete="tel"
                    className="form-control pl-9 text-sm"
                  />
                </div>
              </div>
            )}

            <button disabled={loading || (isGuest && !guestDetailsValid)} onClick={() => pay()} className="btn btn-primary w-full justify-center">
              <CreditCard className="w-4 h-4" /> {loading ? 'Opening Razorpay...' : 'Pay Now'}
            </button>
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
