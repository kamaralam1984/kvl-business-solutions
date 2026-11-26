import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/lib/data/services';

// Hairline index of services; rows fill lime on hover. Studio design only (hidden in Classic).
export function StudioServiceIndex({ limit, bare = false, label = '( 02 ) Services' }: { limit?: number; bare?: boolean; label?: string }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <section className={bare ? 'sx-index sx-only sx-index-bare' : 'sx-index sx-only'}>
      <div className={bare ? undefined : 'container'}>
        {!bare && <p className="sx-label">{label}</p>}
        <ul>
          {list.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="sx-row">
                <span className="sx-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sx-name">{s.name}</span>
                <span className="sx-desc">{s.description}</span>
                <ArrowUpRight className="sx-arrow" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        {!bare && <Link href="/services" className="sx-all">All services <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>}
      </div>
    </section>
  );
}
