import { Quote } from 'lucide-react';
import { testimonials } from '@/lib/data/testimonials';
import { TiltCard } from '@/components/shared/TiltCard';

export function Testimonials({ limit }: { limit?: number }) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <span className="eyebrow">CLIENT VOICES</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">What Our Clients Say</h2>
          <p className="text-text2 max-w-xl mx-auto">Trusted by 1000+ businesses across India for software, GPS, and industrial solutions.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <TiltCard key={i} className="card-base p-7 relative">
              <Quote className="absolute top-5 right-5 w-9 h-9 text-primary opacity-15" />
              <div className="text-yellow-500 text-sm mb-3">★★★★★</div>
              <p className="text-text2 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full grid place-items-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }}>{t.initials}</div>
                <div>
                  <h5 className="text-sm font-bold">{t.name}</h5>
                  <p className="text-xs text-text2">{t.role}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
