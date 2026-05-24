import { PageHero } from '@/components/shared/PageHero';
import { TrustedBy } from '@/components/home/TrustedBy';
import { Testimonials } from '@/components/home/Testimonials';
import { TiltCard } from '@/components/shared/TiltCard';
import { PlayCircle } from 'lucide-react';

export const metadata = { title: 'Clients & Testimonials — KVL Business Solutions' };

const videos = [
  { title: 'How TransCorp saved ₹2 Cr/year', desc: '2,400 vehicles, 38% fuel savings, 5x ROI', c1: '#3b82f6', c2: '#1d4ed8' },
  { title: 'Bright Future Academy goes paperless', desc: '32 schools digitized, parents happy', c1: '#22c55e', c2: '#16a34a' },
  { title: 'Steelforge factory automation', desc: 'OEE up 42%, downtime down 30%', c1: '#f97316', c2: '#ea580c' },
];

export default function ClientsPage() {
  return (
    <>
      <PageHero eyebrow="OUR CLIENTS" title="Loved by" accent="1000+ Businesses" description="From small workshops to government agencies — trusted across India." breadcrumb="Clients" />
      <TrustedBy />
      <Testimonials />
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">VIDEO REVIEWS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Hear It From Our Clients</h2>
            <p className="text-text2 max-w-xl mx-auto">Watch real stories of business transformation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {videos.map(v => (
              <TiltCard key={v.title} className="card-base overflow-hidden cursor-pointer group">
                <div className="h-44 relative grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${v.c1}, ${v.c2})` }}>
                  <PlayCircle className="w-14 h-14 opacity-80 group-hover:scale-110 transition-all" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold">{v.title}</h4>
                  <p className="text-xs text-text2 mt-1">{v.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
