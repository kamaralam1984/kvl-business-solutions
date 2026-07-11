import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowUpRight, ArrowRight, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=25.5941,85.1376';

const RELATED_SERVICE_SLUGS = ['custom-software', 'website', 'erp', 'crm', 'ai', 'digital-marketing'];
const RELATED_INDUSTRY_SLUGS = ['schools', 'hospitals', 'retail', 'construction', 'government', 'finance'];
const RELATED_CASE_STUDY_SLUGS = ['vidyt', 'aapkaplot', 'restro-os'];

const whyChooseReasons = [
  'A real, visitable office in Patna — meet the engineering team in person, not just over a video call.',
  "ISO 27001 certified and MSME registered — the same security and compliance standards we'd offer an enterprise client anywhere.",
  'GST-compliant invoicing and pricing that makes sense for a Bihar-based business, not a US/UK enterprise budget.',
  'Direct access to the engineers building your system — no relationship manager relaying messages from a different city.',
  'Local business context — we already understand the compliance, vendor and customer realities of running a business in Bihar.',
  'A year of free post-launch support and updates included on every project, standard.',
];

const businessContext = [
  "Patna and Bihar's business landscape has changed faster in the last five years than in the two decades before it — schools and colleges digitising admissions and fees, hospitals moving patient records off paper registers, retailers opening a second and third outlet, and government-adjacent contractors needing proper compliance documentation instead of a filing cabinet. Each of these is a software problem before it's anything else, and most of the businesses living it don't need a Delhi or Bangalore agency's overhead to solve it.",
  "What's held a lot of Bihar-based businesses back from proper software isn't a lack of demand — it's that most serious software companies are headquartered in the metros and treat a Patna client as a remote afterthought, handled by whoever's free that week. We built KVL the other way around: headquartered in Patna, with an in-house engineering team that treats a local school, hospital, retailer or NBFC with the same process discipline — fixed scope, fixed pricing, weekly demos — that a national enterprise client gets.",
  "Being based here also means we're not guessing at the constraints — GST invoicing rules, local vendor and staffing patterns, the realities of running a multi-branch retail or NBFC operation across Bihar, or a school managing admissions across a full academic year. That context shows up in the software itself, not just the sales conversation.",
];

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] || Icons.Box;
  return <Cmp className={className} />;
}

const title = 'Software Development Company in Patna, Bihar | KVL Business Solutions';
const description = 'KVL Business Solutions is a Patna, Bihar-based software development company — custom software, ERP, CRM and AI automation for schools, hospitals, retailers and NBFCs, with a real local office and in-house engineering team.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/software-development-company-patna` },
  openGraph: { title, description, url: `${SITE}/software-development-company-patna`, type: 'website' },
};

export default function PatnaLandingPage() {
  const relatedServices = RELATED_SERVICE_SLUGS
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const relatedIndustries = RELATED_INDUSTRY_SLUGS
    .map(slug => industries.find(i => i.slug === slug))
    .filter(Boolean) as typeof industries[number][];

  const relatedCaseStudies = RELATED_CASE_STUDY_SLUGS
    .map(slug => caseStudies.find(c => c.slug === slug))
    .filter(Boolean) as typeof caseStudies;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE}/software-development-company-patna`,
    about: 'Software development services for businesses in Patna and Bihar',
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Custom Software Development',
    name: 'Software Development Services in Patna, Bihar',
    description,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: { '@type': 'City', name: 'Patna', containedInPlace: { '@type': 'State', name: 'Bihar' } },
    url: `${SITE}/software-development-company-patna`,
  };

  const faq = [
    { q: 'Do you have a real office in Patna we can visit?', a: 'Yes — KVL is headquartered in Sultanganj, Patna, Bihar. You can visit in person or meet the engineering team directly, unlike agencies that route Bihar clients through a call centre in another city.' },
    { q: 'Do you only work with Patna businesses, or across Bihar?', a: "We work with businesses across Bihar — Patna, Muzaffarpur, Bhagalpur, Gaya and beyond — as well as clients nationally and internationally. Being Patna-based doesn't limit who we serve; it just means local clients get in-person access." },
    { q: 'What kind of businesses in Patna/Bihar do you typically build for?', a: 'Schools and colleges, hospitals and clinics, multi-outlet retailers, construction contractors, government-adjacent vendors, and NBFCs/lending businesses are the industries we see most often — see the Industries section below.' },
    { q: 'How is pricing structured for a Bihar-based business?', a: "We quote in INR with GST-compliant invoicing, and pricing reflects a Bihar-market budget rather than a metro-agency rate card — fixed-price contracts with a written scope, agreed before development starts." },
    { q: 'Can you also handle GPS tracking, CCTV or industrial automation alongside the software?', a: 'Yes — for local clients we can bundle software with GPS fleet installation, CCTV/security systems, and industrial automation under one team, so you\'re not coordinating multiple vendors.' },
    { q: 'What happens after the project goes live?', a: 'A year of free support and bug fixes is standard on every project, with local, in-person support available for Patna and Bihar-based clients if an issue needs a site visit.' },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} id="patna-webpage-jsonld" />
      <JsonLd data={serviceJsonLd} id="patna-service-jsonld" />
      <JsonLd data={faqJsonLd} id="patna-faq-jsonld" />

      <PageHero
        eyebrow="LOCAL SOFTWARE PARTNER"
        title="Software Development Company in"
        accent="Patna, Bihar"
        description="A real office, an in-house engineering team, and the same fixed-scope, fixed-price process we'd offer any client — built for schools, hospitals, retailers and NBFCs across Bihar."
        breadcrumb="Patna, Bihar"
      />

      {/* Honest positioning strip */}
      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          Headquartered in Sultanganj, Patna, Bihar — visit our office, or work with us remotely, wherever your business is based.
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="underline font-semibold" style={{ color: '#a3814f' }}>
            View on Google Maps
          </a>
        </div>
      </section>

      {/* Why choose */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Why KVL</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Why Patna &amp; Bihar Businesses Choose KVL</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {whyChooseReasons.map(r => (
              <div key={r} className="card-base p-6 flex gap-3 items-start">
                <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: '#c8a870' }} />
                <span className="text-[14px] leading-[1.7]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business context */}
      <section className="section section-alt">
        <div className="container max-w-3xl">
          <span className="eyebrow">The Bihar Market</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Building Software for Patna &amp; Bihar Businesses</h2>
          <div className="space-y-5">
            {businessContext.map((p, i) => (
              <p key={i} className="text-text2 text-[15px] leading-[1.8]">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Software Development Services in Patna</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedServices.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card-base p-6 block hover:shadow-card-hover transition-all">
                <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: `${s.color}18`, color: s.color }}>
                  <Icon name={s.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{s.name}</h3>
                <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Industries</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industries We Serve in Bihar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedIndustries.map(ind => (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="card-base p-6 block hover:shadow-card-hover transition-all">
                <div className="w-10 h-10 rounded-xl grid place-items-center mb-4 text-white" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                  <Icon name={ind.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{ind.name}</h3>
                <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{ind.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Proven Work</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Real Products Built From Patna</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCaseStudies.map(cs => (
                <Link key={cs.slug} href={`/projects/${cs.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all group">
                  <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: '#a3814f' }}>{cs.businessCategory}</div>
                  <h3 className="text-xl font-black mb-3">{cs.name}</h3>
                  <p className="text-text2 text-sm mb-4">{cs.overview}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read the case study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section section-alt">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions from Bihar Clients</h2>
          </div>
          <div className="space-y-5">
            {faq.map(f => (
              <div key={f.q} className="card-base p-6">
                <div className="font-bold text-sm mb-2">{f.q}</div>
                <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA row */}
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Ready to Build Something in Patna?</h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/book-demo" className="btn btn-primary">
              Get Free Project Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to a Software Expert
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi KVL, I'm reaching out from Bihar about a software project.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need a Software Partner in Patna?"
        desc="A real office, an in-house team, and a straightforward process — no relationship manager, no metro-agency markup."
      />
    </>
  );
}
