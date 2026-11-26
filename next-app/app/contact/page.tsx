import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { Section, SectionHeading } from '@/components/ui';
import { JsonLd } from '@/components/shared/JsonLd';
import { ContactClient } from './ContactClient';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=25.5941,85.1376';

export const metadata: Metadata = {
  title: 'Contact Us — Talk to a Solution Architect',
  description: 'Get in touch with KVL Business Solutions for a free consultation. We respond within 1 hour during business hours — no obligation, no sales pressure.',
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: 'Contact Us — Talk to a Solution Architect | KVL Business Solutions',
    description: 'Get in touch with KVL Business Solutions for a free consultation. We respond within 1 hour during business hours — no obligation, no sales pressure.',
    url: `${SITE}/contact`,
    type: 'website',
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact KVL Business Solutions',
    url: `${SITE}/contact`,
    about: { '@id': `${SITE}/#organization` },
    mainEntity: { '@id': `${SITE}/#organization` },
  };

  return (
    <div className="bg-bg">
      <JsonLd data={contactPageJsonLd} id="contact-page-jsonld" />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden bg-bg py-[var(--section-y)]">
        <div className="container relative z-10 text-center">
          <span className="eyebrow">CONTACT US</span>
          <h1 className="mx-auto mt-4 mb-6 max-w-4xl font-display text-hero text-text">
            Talk to a Solution Architect
          </h1>
          <p className="mx-auto max-w-2xl text-body-lg text-text2">
            Tell us what you&apos;re building. We respond within 1 hour during business hours — free consultation, no obligation.
          </p>
        </div>
      </section>

      <ContactClient settings={settings} />

      {/* Map */}
      <Section tone="alt">
        <SectionHeading
          align="center"
          eyebrow="VISIT US"
          title="Our Offices"
          description={`Headquartered in ${settings.addressLine1 || 'Patna'} with branches across India.`}
        />
        <div className="relative mt-12 h-80 overflow-hidden rounded-card border border-line shadow-soft-1">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=85.0126%2C25.4941%2C85.2626%2C25.6941&layer=mapnik&marker=25.5941%2C85.1376"
            className="h-full w-full border-0"
            loading="lazy"
            title="KVL HQ Location — Patna, Bihar"
          />
        </div>
        <div className="mt-5 text-center">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-btn px-3 text-sm font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <MapPin className="h-4 w-4" aria-hidden /> View on Google Maps
          </a>
        </div>
      </Section>
    </div>
  );
}
