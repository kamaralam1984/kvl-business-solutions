'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { Star, ArrowUpRight } from 'lucide-react';

type Review = {
  _id: string;
  name: string;
  company?: string;
  rating: number;
  title?: string;
  message: string;
  productSlug?: string;
};

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const { ref, inView } = useReveal();

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => setReviews(d.ok ? d.reviews.slice(0, 3) : []))
      .catch(() => setReviews([]));
  }, []);

  const hasReviews = reviews && reviews.length > 0;

  return (
    <section className={hasReviews ? 'py-28' : 'py-16'} style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">

        {/* Section header */}
        <div className={`max-w-2xl mx-auto text-center ${hasReviews ? 'mb-16' : 'mb-10'}`}>
          <span className="eyebrow mb-4 block">Reviews</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Client reviews,<br />
            <span style={{ color: '#c8a870' }}>verified — not written by us.</span>
          </h2>
        </div>

        {hasReviews ? (
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {reviews!.map((r, i) => (
              <div key={r._id} style={revealStyle(inView, i, { staggerMs: 100, durationMs: 550 })}>
                <div className="card-premium h-full p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full grid place-items-center font-bold text-[13px]"
                      style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)', color: '#c8a870' }}>
                      {r.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold" style={{ color: 'rgb(var(--text))' }}>{r.name}</div>
                      {r.company && <div className="text-[11.5px]" style={{ color: 'rgb(var(--text-3))' }}>{r.company}</div>}
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5" fill={i < r.rating ? '#c8a870' : 'none'} style={{ color: '#c8a870' }} />
                    ))}
                  </div>
                  <p className="text-[13.5px] leading-[1.7]" style={{ color: 'rgb(var(--text-2))' }}>{r.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card-premium p-10">
              <h3 className="font-display font-bold text-[1.3rem] mb-3" style={{ color: 'rgb(var(--text))' }}>
                Our proof runs in production, not in quotes.
              </h3>
              <p className="text-[14px] leading-[1.7] mb-6" style={{ color: 'rgb(var(--text-2))' }}>
                See the live products above, or talk to us directly.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200"
                style={{ background: '#0a0a0a', color: '#ffffff' }}
              >
                Talk to a Solution Architect
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[12px] mt-6" style={{ color: 'rgb(var(--text-3))' }}>
                Founded 2019. Every product shown above is live and checkable today — no quotes required.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
