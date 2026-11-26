import { MapPin } from 'lucide-react';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import {
  Icon, StripNote, WhyGrid, MarketSection, LinkCardGrid, CaseGrid, FaqSection, CtaRow,
} from '@/components/location-landing/shared';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=25.5941,85.1376';

const RELATED_SERVICE_SLUGS = ['custom-software', 'website', 'erp', 'crm', 'ai', 'digital-marketing'];
const RELATED_INDUSTRY_SLUGS = ['schools', 'hospitals', 'retail', 'construction', 'government', 'finance'];
const RELATED_CASE_STUDY_SLUGS = ['vidyt', 'aapkaplot', 'restro-os'];

const whyChooseReasons = [
  'A real, visitable office in Patna — meet the engineering team in person, not just over a video call.',
  "MSME registered, with an NDA available on request — the same security and compliance standards we'd offer an enterprise client anywhere.",
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

      <StripNote icon={<MapPin className="h-4 w-4" aria-hidden />}>
        Headquartered in Sultanganj, Patna, Bihar — visit our office, or work with us remotely, wherever your business is based.
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center rounded-btn font-semibold text-gold-text underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
          View on Google Maps
        </a>
      </StripNote>

      <WhyGrid reasons={whyChooseReasons} title={<>Why Patna &amp; Bihar Businesses Choose KVL</>} />

      <MarketSection eyebrow="The Bihar Market" title={<>Building Software for Patna &amp; Bihar Businesses</>} paragraphs={businessContext} />

      <LinkCardGrid
        eyebrow="Services"
        title="Software Development Services in Patna"
        items={relatedServices.map(s => ({
          key: s.slug, href: `/services/${s.slug}`, title: s.name, desc: s.description,
          icon: <Icon name={s.icon} className="h-5 w-5" />,
        }))}
      />

      <LinkCardGrid
        tone="alt"
        eyebrow="Industries"
        title="Industries We Serve in Bihar"
        items={relatedIndustries.map(ind => ({
          key: ind.slug, href: `/industries/${ind.slug}`, title: ind.name, desc: ind.desc,
          icon: <Icon name={ind.icon} className="h-5 w-5" />,
        }))}
      />

      {relatedCaseStudies.length > 0 && (
        <CaseGrid items={relatedCaseStudies} wide title="Real Products Built From Patna" />
      )}

      <FaqSection tone="alt" faq={faq} title="Common Questions from Bihar Clients" />

      <CtaRow
        heading="Ready to Build Something in Patna?"
        waText="Hi KVL, I'm reaching out from Bihar about a software project."
      />

      <CtaBanner
        title="Need a Software Partner in Patna?"
        desc="A real office, an in-house team, and a straightforward process — no relationship manager, no metro-agency markup."
      />
    </>
  );
}
