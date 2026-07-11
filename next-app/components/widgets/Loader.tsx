import Image from 'next/image';

const RING_TEXT = 'KVL BUSINESS SOLUTIONS  •  KVL BUSINESS SOLUTIONS  •  ';

export function Loader({ label = 'Loading', fullscreen = false }: { label?: string; fullscreen?: boolean }) {
  return (
    <div
      className={fullscreen ? 'fixed inset-0 z-[999] grid place-items-center' : 'min-h-[70vh] grid place-items-center p-4'}
      style={fullscreen ? { background: 'rgb(var(--bg))' } : undefined}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="loader-badge relative" style={{ width: 168, height: 168 }}>
          {/* Ambient glow */}
          <div className="loader-glow absolute inset-0 rounded-full" aria-hidden />

          {/* Rotating circular brand text */}
          <svg viewBox="0 0 168 168" className="loader-ring absolute inset-0" aria-hidden>
            <defs>
              <path id="loaderRingPath" d="M 84,84 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
            </defs>
            <text fontSize="9.5" fontWeight={700} letterSpacing="2.5">
              <textPath href="#loaderRingPath" startOffset="0%" className="loader-ring-text">
                {RING_TEXT}
              </textPath>
            </text>
          </svg>

          {/* Spinning, glowing logo */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="loader-logo rounded-full overflow-hidden" style={{ width: 92, height: 92 }}>
              <Image src="/loader-logo.png" alt="KVL Business Solutions" width={92} height={92} priority className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="text-[11px] font-bold tracking-[3px] uppercase text-text2">{label}</div>
      </div>
    </div>
  );
}
