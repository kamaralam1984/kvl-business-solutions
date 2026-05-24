import { Award, Shield, Landmark, Handshake } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';

const certs = [
  { Icon: Award, name: 'ISO 9001:2015', desc: 'Quality Certified', c1: '#3b82f6', c2: '#1d4ed8' },
  { Icon: Shield, name: 'ISO 27001', desc: 'Security Certified', c1: '#22c55e', c2: '#16a34a' },
  { Icon: Landmark, name: 'MSME Registered', desc: 'Govt. of India', c1: '#f97316', c2: '#ea580c' },
  { Icon: Handshake, name: 'Startup India', desc: 'DPIIT Recognized', c1: '#eab308', c2: '#a16207' },
];

export function Certifications() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <span className="eyebrow">CERTIFIED &amp; TRUSTED</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Trusted Credentials</h2>
          <p className="text-text2 max-w-xl mx-auto">Recognized by government, industry bodies and global standards.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map(c => (
            <TiltCard key={c.name} className="card-base p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}>
                <c.Icon className="w-7 h-7" />
              </div>
              <h5 className="font-bold">{c.name}</h5>
              <p className="text-xs text-text2">{c.desc}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
