'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { CheckCircle2, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

function SuccessInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const orderId = sp.get('order') || '';
  const email = sp.get('email') || '';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [existingAccount, setExistingAccount] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        if (/already registered/i.test(data.error || '')) { setExistingAccount(true); return; }
        setErr(data.error || 'Could not create account');
        return;
      }
      await signIn('credentials', { email, password, redirect: false });
      await update();
      router.push(`/dashboard/orders/${orderId}`);
    } catch {
      setErr('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg py-16">
      <div className="card-premium p-8 text-center mb-6">
        <div
          className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-4"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold">Payment successful!</h1>
        <p className="text-text2 text-sm mt-2">
          Order <span className="font-mono font-semibold">{orderId}</span> is confirmed. Your license key and invoice are on their way to{' '}
          <span className="font-semibold">{email}</span>.
        </p>
      </div>

      {skipped ? (
        <div className="card-base p-6 text-center">
          <p className="text-sm text-text2">No problem — everything&apos;s in your inbox. You can create an account anytime to track this order from a dashboard.</p>
          <Link href="/" className="btn btn-ghost mt-4 inline-flex">Back to homepage</Link>
        </div>
      ) : existingAccount ? (
        <div className="card-base p-6 text-center">
          <p className="text-sm mb-4">
            You already have an account with <span className="font-semibold">{email}</span> — log in to see this order in your dashboard.
          </p>
          <Link href={`/login?callbackUrl=/dashboard/orders/${orderId}`} className="btn btn-primary w-full justify-center">
            Log in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="card-base p-6">
          <h2 className="font-bold mb-1">Create a free account</h2>
          <p className="text-text2 text-xs mb-4">Track your order, download invoices, and get your license key from one dashboard.</p>
          <form onSubmit={createAccount} className="space-y-3">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
              <input
                required placeholder="Your full name" autoComplete="name"
                value={name} onChange={e => setName(e.target.value)}
                className="form-control pl-9 text-sm"
              />
            </div>
            <input disabled value={email} className="form-control text-sm opacity-60" />
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
              <input
                required type="password" minLength={6} autoComplete="new-password"
                placeholder="Set a password (6+ characters)"
                value={password} onChange={e => setPassword(e.target.value)}
                className="form-control pl-9 text-sm"
              />
            </div>
            {err && <p className="text-red-500 text-xs">{err}</p>}
            <button disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <button onClick={() => setSkipped(true)} className="text-xs text-text2 hover:text-primary mt-3 w-full text-center">
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return <Suspense fallback={<div className="container py-20 text-center">Loading…</div>}><SuccessInner /></Suspense>;
}
