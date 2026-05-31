import { getSiteSettings } from '@/lib/models/SiteSettings';
import { ContactClient } from './ContactClient';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div style={{ background: '#0a0a0a' }} className="text-white">

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-24">
          <span className="eyebrow">CONTACT US</span>
          <h1
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight"
            style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}
          >
            Get In Touch
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#888' }}>
            We respond within 1 hour during business hours. Free consultation, no obligation.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      <ContactClient settings={settings} />

      {/* Map */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">VISIT US</span>
            <h2 className="text-4xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Our Offices
            </h2>
            <p className="text-sm" style={{ color: '#888' }}>
              Headquartered in {settings.addressLine1 || 'Pune'} with branches across India.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 relative" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)' }} />
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.7%2C18.45%2C73.95%2C18.65&layer=mapnik&marker=18.5204%2C73.8567"
              className="w-full h-full border-0 opacity-70"
              loading="lazy"
              title="KVL HQ Location"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
