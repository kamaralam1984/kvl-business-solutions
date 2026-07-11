import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/models/SiteSettings';
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
    <div style={{ background: 'rgb(var(--bg))' }}>
      <JsonLd data={contactPageJsonLd} id="contact-page-jsonld" />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-24">
          <span className="eyebrow">CONTACT US</span>
          <h1
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight text-text"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Talk to a Solution Architect
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-text2">
            Tell us what you're building. We respond within 1 hour during business hours — free consultation, no obligation.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      <ContactClient settings={settings} />

      {/* Map */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">VISIT US</span>
            <h2 className="text-4xl font-extrabold my-4 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Our Offices
            </h2>
            <p className="text-sm text-text2">
              Headquartered in {settings.addressLine1 || 'Patna'} with branches across India.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 relative" style={{ border: '1px solid rgba(var(--border) / 0.07)' }}>
            <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)' }} />
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.0126%2C25.4941%2C85.2626%2C25.6941&layer=mapnik&marker=25.5941%2C85.1376"
              className="w-full h-full border-0 opacity-70"
              loading="lazy"
              title="KVL HQ Location — Patna, Bihar"
            />
          </div>
          <div className="text-center mt-5">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#c8a870' }}
            >
              <MapPin className="w-4 h-4" /> View on Google Maps
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
