'use client';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { SectionHeading, Card, Button } from '@/components/ui';

type Review = { _id: string; name: string; company?: string; rating: number; message: string };

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => setReviews(d.ok ? d.reviews.slice(0, 3) : []))
      .catch(() => setReviews([]));
  }, []);

  const hasReviews = !!reviews && reviews.length > 0;

  return (
    <section className="bg-bg2 py-[var(--section-y)]">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Reviews"
          title={<>Client reviews, <span className="text-gold-text">verified — not written by us.</span></>}
        />

        {hasReviews ? (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {reviews!.map(r => (
              <Card key={r._id} className="p-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 font-display font-semibold text-gold-text">
                    {r.name[0]?.toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-text">{r.name}</div>
                    {r.company && <div className="text-xs text-text2">{r.company}</div>}
                  </div>
                </div>
                <div className="mb-3 flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold" fill={i < r.rating ? 'currentColor' : 'none'} aria-hidden />
                  ))}
                </div>
                <p className="text-text2">{r.message}</p>
              </Card>
            ))}
          </div>
        ) : (
          reviews !== null && (
            <Card className="mx-auto mt-10 max-w-2xl p-8 text-center sm:p-10">
              <h3 className="font-display text-card-title text-text">Our proof runs in production, not in quotes.</h3>
              <p className="mt-3 text-text2">See the live products above, or talk to us directly.</p>
              <Button href="/book-demo" className="mt-6">Talk to a Solution Architect</Button>
              <p className="mt-6 text-xs text-text2">Founded 2015. Every product shown above is live and checkable today — no quotes required.</p>
            </Card>
          )
        )}
      </div>
    </section>
  );
}
