// Animated tricolor flag — pure SVG, no external image assets. The cloth
// "wave" is a feTurbulence + feDisplacementMap filter animated via <animate>,
// not a raster photo, so it stays crisp at any size and needs no network fetch.
let uid = 0;

export function IndianFlag({ width = 160, withPole = true, className = '' }: { width?: number; withPole?: boolean; className?: string }) {
  const id = `flag-wave-${++uid}`;
  const height = Math.round(width * 0.62);
  const chakrR = height * 0.14;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <div className={`inline-flex items-end ${className}`} style={{ width: withPole ? width + 10 : width }}>
      {withPole && (
        <div
          className="rounded-full shrink-0"
          style={{ width: 5, height: height + 46, background: 'linear-gradient(180deg,#c9a15a,#8a6a2f)' }}
        />
      )}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ marginLeft: withPole ? -2 : 0, marginBottom: withPole ? 40 : 0, filter: `url(#${id})` }}
      >
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.045" numOctaves="2" seed="3" result="turb">
              <animate attributeName="baseFrequency" dur="5s" values="0.010 0.045;0.018 0.06;0.010 0.045" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={height * 0.09} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect x="0" y="0" width={width} height={height / 3} fill="#FF9933" />
        <rect x="0" y={height / 3} width={width} height={height / 3} fill="#FFFFFF" />
        <rect x="0" y={(2 * height) / 3} width={width} height={height / 3} fill="#138808" />
        <circle cx={cx} cy={cy} r={chakrR} fill="none" stroke="#000080" strokeWidth={Math.max(1, height * 0.012)} />
        <circle cx={cx} cy={cy} r={chakrR * 0.12} fill="#000080" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x2 = cx + chakrR * Math.cos(rad);
          const y2 = cy + chakrR * Math.sin(rad);
          return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#000080" strokeWidth={Math.max(0.6, height * 0.006)} />;
        })}
      </svg>
    </div>
  );
}
