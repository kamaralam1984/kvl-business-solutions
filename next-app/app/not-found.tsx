import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 pb-16 pt-32">
      <div className="max-w-md text-center">
        <p className="font-display text-[96px] font-semibold leading-none text-gold-text">404</p>
        <h1 className="mt-3 font-display text-section text-text">Page not found</h1>
        <p className="mt-3 text-text2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Maybe it&apos;s hiding in our software catalog?
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/"><Home className="h-4 w-4" aria-hidden /> Home</Button>
          <Button href="/search" variant="secondary"><Search className="h-4 w-4" aria-hidden /> Search</Button>
          <Button href="/software" variant="secondary"><ArrowLeft className="h-4 w-4" aria-hidden /> Browse Software</Button>
        </div>
      </div>
    </div>
  );
}
