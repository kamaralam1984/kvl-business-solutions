import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

export function PageHero({ eyebrow, title, accent, description, breadcrumb }: { eyebrow: string; title: string; accent?: string; description: string; breadcrumb: string }) {
  return (
    <section className="relative pt-20 pb-16 text-center bg-app2 border-b border-tint overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 blueprint pointer-events-none opacity-60" />
      <div className="container relative z-10">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 mb-4">
          {title} {accent && <span className="gradient-text">{accent}</span>}
        </h1>
        <p className="text-text2 max-w-2xl mx-auto">{description}</p>
        <div className="inline-flex gap-2 mt-4 text-xs text-text2">
          <Link href="/" className="text-primary">Home</Link>
          <ChevronRight className="w-3 h-3 self-center" />
          <span>{breadcrumb}</span>
        </div>
      </div>
    </section>
  );
}
