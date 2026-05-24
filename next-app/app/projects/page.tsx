import * as Icons from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import { BeforeAfterSlider } from '@/components/shared/BeforeAfterSlider';
import { projects } from '@/lib/data/projects';

export const metadata = { title: 'Projects — KVL Business Solutions' };

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="OUR PROJECTS" title="Real Projects," accent="Real Impact" description="500+ enterprise projects delivered across India. Browse our case studies." breadcrumb="Projects" />

      <section className="section">
        <div className="container grid md:grid-cols-2 gap-6">
          {projects.map(p => {
            const Icon = (Icons as any)[p.icon] || Icons.Box;
            return (
              <TiltCard key={p.slug} className="card-base overflow-hidden">
                <div className="h-52 grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}>
                  <Icon className="w-16 h-16 opacity-70" />
                </div>
                <div className="p-6">
                  <span className="text-[11px] text-primary font-bold tracking-widest uppercase">{p.category}</span>
                  <h3 className="text-xl my-2 font-bold">{p.title}</h3>
                  <p className="text-text2 text-sm mb-4">{p.desc}</p>
                  <div className="flex gap-5 pt-4 border-t border-tint">
                    {p.stats.map(s => (
                      <div key={s.lbl}>
                        <div className="text-xl font-extrabold text-primary">{s.num}</div>
                        <div className="text-[11px] text-text2">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">TRANSFORMATION</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Before vs After</h2>
            <p className="text-text2 max-w-xl mx-auto">Drag the slider to see how we transform legacy processes into modern digital experiences.</p>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      <CtaBanner title="Imagine your project on this page next." desc="Let's build something exceptional together." />
    </>
  );
}
