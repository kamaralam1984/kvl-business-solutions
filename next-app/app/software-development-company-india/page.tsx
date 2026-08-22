import Link from 'next/link';
import { ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { indiaStatePages } from '@/lib/data/india-states';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Software Development Company in India — States We Serve | KVL Business Solutions';
const description = 'KVL Business Solutions is a Patna, Bihar-based software development company serving businesses across India — Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, and more — with ERP, CRM, and custom software.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/software-development-company-india` },
  openGraph: { title, description, url: `${SITE}/software-development-company-india`, type: 'website' },
};

export default function IndiaStatesPage() {
  // A directory hub for the state pages, matching the structure of
  // /global (which lists the international country pages) — gives every
  // state page at least one real internal link into it instead of relying
  // solely on the sitemap, and captures the broad "software development
  // company India" query in its own right.
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE}/software-development-company-india`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} id="india-states-webpage-jsonld" />
      <PageHero
        eyebrow="SERVING INDIA"
        title="One Patna-Based Team,"
        accent="Clients Across India"
        description="KVL is headquartered in Patna, Bihar — no branch offices elsewhere in the country. Every state below is served remotely by the same engineering team, same business hours, same national GST framework."
        breadcrumb="India"
      />

      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          We don&apos;t operate branch offices outside Patna — every state below is served remotely by the same team, with direct engineer access throughout.
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {indiaStatePages.map(s => (
              <Link key={s.slug} href={`/software-development-company-${s.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all group">
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#a3814f' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{s.countryName}</h3>
                <p className="text-text2 text-sm mb-5 line-clamp-2">{s.heroTagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Explore <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center max-w-2xl mx-auto">
          <span className="eyebrow">Our Headquarters</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Based in Patna, Bihar</h2>
          <p className="text-text2 text-sm mb-6">Our only physical office is in Patna, Bihar — MSME registered, with an NDA signed before any technical discussion begins. See what makes our home city&apos;s page different — it&apos;s the one page here written about where we actually are, not where we deliver to remotely.</p>
          <Link href="/software-development-company-patna" className="btn btn-ghost">
            Visit the Patna page <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <CtaBanner title="Don't see your state listed?" desc="We serve clients across India remotely from Patna — tell us where you're based and what you're building." />
    </>
  );
}
