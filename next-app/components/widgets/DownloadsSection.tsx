'use client';
import { FileText, Briefcase, BookOpen } from 'lucide-react';
import { DownloadGate } from './DownloadGate';

export function DownloadsSection() {
  return (
    <section className="section section-alt" id="downloads">
      <div className="container">
        <div className="text-center mb-10">
          <span className="eyebrow">Free Resources</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Download More About KVL</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <DownloadGate
            icon={FileText}
            title="Company Profile"
            desc="Who we are, what we do, and how we work."
            downloadHref="/api/downloads/company-profile"
            downloadType="company-profile"
          />
          <DownloadGate
            icon={Briefcase}
            title="Portfolio"
            desc="Real, live projects we've built — with outcomes."
            downloadHref="/api/downloads/portfolio"
            downloadType="portfolio"
          />
          <DownloadGate
            icon={BookOpen}
            title="Service Brochure"
            desc="Every service we offer, in one place."
            downloadHref="/api/downloads/service-brochure"
            downloadType="service-brochure"
          />
        </div>
      </div>
    </section>
  );
}
