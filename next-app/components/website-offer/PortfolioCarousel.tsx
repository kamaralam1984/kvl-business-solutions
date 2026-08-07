'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';

export function PortfolioCarousel({ portfolio }: { portfolio: { slug: string; name: string; industry: string; image: string; tagline: string }[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useReveal();

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#138808' }}>— Our Recent Work —</span>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="hidden sm:grid absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 place-items-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="hidden sm:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 place-items-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div ref={scrollerRef} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {portfolio.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                style={revealStyle(inView, i)}
                className="group shrink-0 w-[260px] snap-start rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="relative h-36 w-full">
                  <Image src={p.image} alt={p.name} fill sizes="260px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 grid place-items-center">
                    <ExternalLink className="w-3 h-3 text-gray-700" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-gray-900">{p.name}</div>
                  <div className="text-[11px] text-gray-500">{p.industry}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/projects" className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-bold" style={{ background: '#138808' }}>
            View All Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
