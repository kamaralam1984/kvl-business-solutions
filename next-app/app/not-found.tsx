import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center p-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-black gradient-text leading-none">404</div>
        <h1 className="text-2xl font-extrabold mt-2">Page not found</h1>
        <p className="text-text2 mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Maybe it&apos;s hiding in our software catalog?
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link href="/" className="btn btn-primary"><Home className="w-4 h-4" /> Home</Link>
          <Link href="/search" className="btn btn-ghost"><Search className="w-4 h-4" /> Search</Link>
          <Link href="/software" className="btn btn-ghost"><ArrowLeft className="w-4 h-4" /> Browse Software</Link>
        </div>
      </div>
    </div>
  );
}
