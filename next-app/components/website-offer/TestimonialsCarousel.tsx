'use client';
import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

type Review = { name: string; company?: string; rating: number; title?: string; message: string };

export function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const groups: Review[][] = [];
  for (let i = 0; i < reviews.length; i += 3) groups.push(reviews.slice(i, i + 3));

  useEffect(() => {
    if (groups.length < 2) return;
    const t = setInterval(() => setActive(a => (a + 1) % groups.length), 6000);
    return () => clearInterval(t);
  }, [groups.length]);

  if (!reviews.length) return null;

  return (
    <section id="testimonials" className="py-20" style={{ background: '#f8f9fb' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#2563eb' }}>— What Our Clients Say —</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {(groups[active] || []).map((r, i) => (
            <div key={`${active}-${i}`} className="rounded-2xl bg-white border border-gray-200 p-5">
              <Quote className="w-5 h-5 text-gray-300 mb-2" />
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">&ldquo;{r.message}&rdquo;</p>
              <div className="font-bold text-sm text-gray-900">{r.name}</div>
              {r.company && <div className="text-[11px] text-gray-500">{r.company}</div>}
            </div>
          ))}
        </div>

        {groups.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-8">
            {groups.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show testimonials group ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{ width: active === i ? 20 : 6, background: active === i ? '#2563eb' : '#d1d5db' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
