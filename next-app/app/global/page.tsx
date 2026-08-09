import Link from 'next/link';
import { ArrowUpRight, Globe2, ShieldCheck, Layers } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { countryPages } from '@/lib/data/country-pages';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Global Software Development — Countries We Serve | KVL Business Solutions';
const description = 'KVL Business Solutions is an India-based software development company serving enterprise clients remotely across the US, UK, Canada, Australia, UAE, Singapore, Germany, Saudi Arabia, Qatar and New Zealand.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/global` },
  openGraph: { title, description, url: `${SITE}/global`, type: 'website' },
};

export default function GlobalPage() {
  return (
    <>
      <PageHero
        eyebrow="GLOBAL DELIVERY"
        title="One India-Based Team,"
        accent="Clients Worldwide"
        description="We're an India-based software development company — no branch offices, no subcontracted teams. Every project for every country is built by the same engineering team, working remotely with clear communication and real overlap hours."
        breadcrumb="Global"
      />

      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          We do not operate local offices in any of the countries below — every engagement is delivered remotely from our team in India.
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryPages.map(c => (
              <Link key={c.slug} href={`/software-development-company-${c.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all group">
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <Globe2 className="w-5 h-5" style={{ color: '#a3814f' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{c.countryName}</h3>
                <p className="text-text2 text-sm mb-5 line-clamp-2">{c.heroTagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Explore <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Industry Solutions</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industries We Serve Internationally</h2>
            <p className="text-text2 text-sm">Custom software development scoped around the specific challenges of your industry, wherever your business is based.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryLandingPages.map(ind => (
              <Link key={ind.slug} href={`/${ind.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all group">
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <Layers className="w-5 h-5" style={{ color: '#a3814f' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{ind.industryName}</h3>
                <p className="text-text2 text-sm mb-5 line-clamp-2">{ind.heroTagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Explore <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title="Don't see your country?" desc="We work with clients worldwide, remotely from India — tell us where you're based and what you're building." />
    </>
  );
}
