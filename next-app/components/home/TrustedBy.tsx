import { trustedBrands } from '@/lib/data/testimonials';

export function TrustedBy() {
  return (
    <section className="py-14 bg-app2 border-t border-tint">
      <div className="container">
        <p className="text-center text-text2 mb-7 text-sm">Trusted by <b className="text-text">1000+ Businesses</b> Across India</p>
        <div className="flex flex-wrap justify-around items-center gap-10 opacity-65">
          {trustedBrands.map(b => (
            <span key={b} className="font-display font-extrabold text-lg text-text2 tracking-wider hover:text-text hover:scale-105 transition-all cursor-default">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
