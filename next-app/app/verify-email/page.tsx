'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyView() {
  const sp = useSearchParams();
  const token = sp.get('token');
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('error'); setMsg('Missing verification token.'); return; }
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) setState('ok');
        else { setState('error'); setMsg(d.error || 'Verification failed'); }
      })
      .catch(() => { setState('error'); setMsg('Network error'); });
  }, [token]);

  return (
    <div className="card-base p-8 max-w-md w-full text-center">
      {state === 'loading' && (
        <>
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <p className="mt-4">Verifying your email…</p>
        </>
      )}
      {state === 'ok' && (
        <>
          <CheckCircle2 className="w-14 h-14 mx-auto text-green-500" />
          <h1 className="text-2xl font-extrabold mt-3">Email verified!</h1>
          <p className="text-text2 mt-1 text-sm">Your account is now active.</p>
          <Link href="/login" className="btn btn-primary mt-5 inline-flex">Go to Login</Link>
        </>
      )}
      {state === 'error' && (
        <>
          <XCircle className="w-14 h-14 mx-auto text-red-500" />
          <h1 className="text-2xl font-extrabold mt-3">Verification Failed</h1>
          <p className="text-text2 mt-1 text-sm">{msg}</p>
          <Link href="/login" className="btn btn-ghost mt-5 inline-flex">Back to Login</Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Suspense fallback={<div>Loading…</div>}>
        <VerifyView />
      </Suspense>
    </div>
  );
}
