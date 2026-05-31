'use client';

const row1 = [
  'Sharma Enterprises', 'Rajesh Industries', 'Tech Solutions Pune', 'Green Valley School',
  'Metro GPS Fleet', 'Vishal Fabrication', 'Modi Construction', 'Smart Agro India',
  'Apex Logistics', 'Pioneer Pharma',
];

const row2 = [
  'City Transport', 'Sunrise Academy', 'Global Traders', 'Innovative Builders',
  'Ravi Auto Parts', 'Karnataka Textiles', 'NextGen Retail', 'Bharat Infra',
  'Excel Finance', 'Power Systems Ltd',
];

const doubled1 = [...row1, ...row1];
const doubled2 = [...row2, ...row2];

function Pill({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-2 mx-4 px-5 py-2.5 rounded-full whitespace-nowrap text-[13px] font-medium shrink-0"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: 'rgba(255,255,255,0.45)',
      }}
    >
      {name}
    </div>
  );
}

export function TrustedBy() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: 'rgb(var(--bg))' }}
    >
      {/* Header */}
      <div className="container relative z-10 mb-10 text-center">
        <span className="eyebrow block mb-3">OUR CLIENTS</span>
        <h3 className="text-xl font-bold" style={{ color: '#f8f8f6' }}>
          Powering businesses across India
        </h3>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative overflow-hidden mb-4">
        {/* Fade masks */}
        <div
          className="absolute top-0 left-0 h-full w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, rgb(var(--bg)), transparent)' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(-90deg, rgb(var(--bg)), transparent)' }}
        />
        <div className="marquee-track">
          {doubled1.map((name, i) => (
            <Pill key={i} name={name} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="relative overflow-hidden">
        {/* Fade masks */}
        <div
          className="absolute top-0 left-0 h-full w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, rgb(var(--bg)), transparent)' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(-90deg, rgb(var(--bg)), transparent)' }}
        />
        <div className="marquee-track-rev">
          {doubled2.map((name, i) => (
            <Pill key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
