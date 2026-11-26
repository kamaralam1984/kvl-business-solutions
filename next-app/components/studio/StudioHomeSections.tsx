import { StudioServiceIndex } from './StudioServiceIndex';

// Home-page sections that exist only in the Studio design (hidden by CSS in Classic).
// All copy comes from the existing service catalogue — nothing invented.
const STATEMENT = 'We design and build the software that runs your business — ERP, CRM, AI and everything between.'.split(' ').map((t, i) => ({ t, hl: i >= 7 && i <= 9 }));
const WORDS = ['Custom software', 'ERP', 'CRM', 'AI automation', 'Websites', 'Mobile apps', 'GPS tracking', 'Cloud'];

export function StudioHomeSections() {
  return (
    <div className="sx-only">
      {/* 1 — marquee */}
      <div className="sx-marquee" aria-hidden>
        <div className="sx-marquee-track">
          {[0, 1].map(k => (
            <div key={k} className="sx-marquee-set">
              {WORDS.map(w => <span key={w + k}>{w}<i /></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* 2 — statement with drifting colour blobs */}
      <section className="sx-statement">
        <span className="sx-blob sx-blob-a" aria-hidden />
        <span className="sx-blob sx-blob-b" aria-hidden />
        <div className="container relative">
          <p className="sx-label">( 01 ) What we do</p>
          <p className="sx-big" aria-label={STATEMENT.map(w => w.t).join(' ')}>
            {STATEMENT.map((w, i) => (
              <span key={i} aria-hidden className={w.hl ? 'sx-lit sx-hl' : 'sx-lit'} style={{ '--i': i, '--n': STATEMENT.length } as React.CSSProperties}>{w.t} </span>
            ))}
          </p>
        </div>
      </section>

      {/* 3 — service index */}
      <StudioServiceIndex limit={8} />
    </div>
  );
}
