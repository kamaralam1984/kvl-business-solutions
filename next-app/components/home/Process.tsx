'use client';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';

const steps = [
  { num: '01', title: 'Discover',    desc: 'We learn your business, your goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

export function Process() {
  const { ref, inView } = useReveal();

  return (
    <section className="py-28" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="eyebrow mb-4 block">How We Work</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            The same process, every time —<br />
            <span style={{ color: '#c8a870' }}>nothing left to chance.</span>
          </h2>
        </div>

        {/* Process steps */}
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.num} style={revealStyle(inView, i, { staggerMs: 70, distance: 22 })}>
              <div className="card-premium h-full p-6">
                <div className="w-11 h-11 rounded-full grid place-items-center mb-5 font-display font-bold text-[13px]"
                  style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)', color: '#c8a870' }}>
                  {s.num}
                </div>

                <h3 className="font-display font-bold text-[1rem] mb-2 leading-snug" style={{ color: 'rgb(var(--text))' }}>
                  {s.title}
                </h3>

                <p className="text-[13px] leading-[1.65]" style={{ color: 'rgb(var(--text-2))' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
