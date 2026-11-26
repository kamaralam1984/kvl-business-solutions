'use client';
import { useEffect } from 'react';
import { RefreshCcw, Home } from 'lucide-react';
import { Button, StateMessage } from '@/components/ui';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="grid min-h-[70vh] w-full min-w-0 grid-cols-[minmax(0,1fr)] place-items-center px-4 pb-16 pt-32">
      <StateMessage
        kind="error"
        title="Something went wrong"
        description={<>{process.env.NODE_ENV === 'development' && error.message ? error.message : 'An unexpected error occurred. Please try again in a moment.'}{error.digest && <span className="mt-2 block font-mono text-[11px]">Ref: {error.digest}</span>}</>}
        action={<>
          <Button onClick={reset}><RefreshCcw className="h-4 w-4" aria-hidden /> Try again</Button>
          <Button href="/" variant="secondary"><Home className="h-4 w-4" aria-hidden /> Home</Button>
        </>}
      />
    </div>
  );
}
