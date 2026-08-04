'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function UnsubView() {
  const sp = useSearchParams();
  const email = sp.get('email');
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    if (!email) { setState('error'); return; }
    fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, { method: 'DELETE' })
      .then(r => r.json()).then(d => setState(d.ok ? 'ok' : 'error'))
      .catch(() => setState('error'));
  }, [email]);

  return (
    <div className="card-base p-8 max-w-md w-full text-center">
      {state === 'loading' && <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />}
      {state === 'ok' && (
        <>
          <CheckCircle2 className="w-14 h-14 mx-auto text-green-500" />
          <h1 className="text-2xl font-extrabold mt-3">Unsubscribed</h1>
          <p className="text-text2 mt-2 text-sm">You won&apos;t receive newsletter emails from us. Sorry to see you go.</p>
        </>
      )}
      {state === 'error' && (
        <>
          <XCircle className="w-14 h-14 mx-auto text-red-500" />
          <h1 className="text-2xl font-extrabold mt-3">Couldn&apos;t unsubscribe</h1>
          <p className="text-text2 mt-2 text-sm">Invalid link. Email us at <a href="mailto:info@kvlbusinesssolutions.com" className="text-primary">info@kvlbusinesssolutions.com</a> to opt out.</p>
        </>
      )}
      <Link href="/" className="btn btn-ghost mt-4 inline-flex">Back to Home</Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Suspense fallback={<div>Loading…</div>}><UnsubView /></Suspense>
    </div>
  );
}
