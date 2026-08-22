'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, LifeBuoy, AlertTriangle } from 'lucide-react';

// A render error anywhere under /checkout falls back to this instead of the
// root app/error.tsx — same graceful treatment, but with checkout-specific
// reassurance: a crash here can happen mid-payment, and a generic "something
// went wrong" reads as scarier than it needs to when money might be involved.
export default function CheckoutError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="container max-w-lg py-20 text-center">
      <div className="card-base p-8">
        <AlertTriangle className="w-14 h-14 mx-auto text-red-500" />
        <h1 className="text-2xl font-extrabold mt-3">Checkout hit a snag</h1>
        <p className="text-text2 text-sm mt-2">
          This is a display error, not a payment problem — if you weren&apos;t charged, no amount was deducted. Try again below.
          If you were charged and this page broke afterward, don&apos;t pay again — check your email for confirmation or contact support.
        </p>
        {error.digest && <p className="text-[10px] text-text2 font-mono mt-2">Ref: {error.digest}</p>}
        <div className="flex gap-3 justify-center mt-5">
          <button onClick={reset} className="btn btn-primary"><RefreshCcw className="w-4 h-4" /> Try again</button>
          <Link href="/support" className="btn btn-ghost"><LifeBuoy className="w-4 h-4" /> Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
