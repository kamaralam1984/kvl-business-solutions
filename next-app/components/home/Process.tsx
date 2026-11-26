import { SectionHeading } from '@/components/ui';

const steps = [
  { num: '01', title: 'Discover',    desc: 'We learn your business, your goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

// 7-step timeline: horizontal on desktop, vertical (line on the left) on mobile.
export function Process() {
  return (
    <section className="bg-bg2 py-[var(--section-y)]">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title={<>The same process, every time — <span className="text-gold-text">nothing left to chance.</span></>}
        />
        <ol className="relative mt-14 grid gap-9 lg:grid-cols-7 lg:gap-5">
          <span aria-hidden className="absolute bottom-0 left-[21px] top-0 w-px bg-line lg:bottom-auto lg:left-[22px] lg:right-[calc(100%/7)] lg:top-[21px] lg:h-px lg:w-auto" />
          {steps.map(s => (
            <li key={s.num} className="relative pl-16 lg:pl-0 lg:pt-16">
              <span className="absolute left-0 top-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold bg-card font-display text-sm font-semibold text-gold-text">
                {s.num}
              </span>
              <h3 className="font-display text-base font-semibold text-text">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text2">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
