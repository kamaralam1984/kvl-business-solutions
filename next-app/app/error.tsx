'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-[70vh] grid place-items-center p-4">
      <div className="card-base p-8 max-w-md text-center">
        <AlertTriangle className="w-14 h-14 mx-auto text-red-500" />
        <h1 className="text-2xl font-extrabold mt-3">Something went wrong</h1>
        <p className="text-text2 text-sm mt-2">{error.message || 'An unexpected error occurred. Our team has been notified.'}</p>
        {error.digest && <p className="text-[10px] text-text2 font-mono mt-2">Ref: {error.digest}</p>}
        <div className="flex gap-3 justify-center mt-5">
          <button onClick={reset} className="btn btn-primary"><RefreshCcw className="w-4 h-4" /> Try again</button>
          <Link href="/" className="btn btn-ghost"><Home className="w-4 h-4" /> Home</Link>
        </div>
      </div>
    </div>
  );
}
