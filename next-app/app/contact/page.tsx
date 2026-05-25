import { PageHero } from '@/components/shared/PageHero';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { ContactClient } from './ContactClient';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="Let's Build Something"
        accent="Amazing Together"
        description="We respond within 1 hour during business hours. Free consultation, no obligation."
        breadcrumb="Contact"
      />
      <ContactClient settings={settings} />
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">VISIT US</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Offices</h2>
            <p className="text-text2">Headquartered in {settings.addressLine1 || 'Pune'} with branches across India.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-tint h-80">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.7%2C18.45%2C73.95%2C18.65&layer=mapnik&marker=18.5204%2C73.8567"
              className="w-full h-full border-0"
              loading="lazy"
              title="KVL HQ Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
