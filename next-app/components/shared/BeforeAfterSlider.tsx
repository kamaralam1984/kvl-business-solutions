'use client';
import { useRef, useState } from 'react';
import { Rocket, FileText, MoveHorizontal } from 'lucide-react';

export function BeforeAfterSlider() {
  const wrap = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const move = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setPos(pct);
  };

  return (
    <div
      ref={wrap}
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-tint select-none aspect-video bg-[#0c1740]"
    >
      <div className="absolute inset-0 grid place-items-center text-white bg-gradient-to-br from-slate-600 to-slate-900">
        <div className="text-center">
          <FileText className="w-20 h-20 opacity-40 mx-auto" />
          <h4 className="mt-4 text-xl font-bold">Manual paper-based workflow</h4>
          <p className="opacity-70 text-sm">Slow · Error-prone · No visibility</p>
        </div>
      </div>
      <div className="absolute inset-0 grid place-items-center text-white bg-gradient-to-br from-blue-500 to-blue-800" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <div className="text-center">
          <Rocket className="w-20 h-20 mx-auto" />
          <h4 className="mt-4 text-xl font-bold">KVL automated platform</h4>
          <p className="text-sm">Real-time · Mobile · 10× faster</p>
        </div>
      </div>
      <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full">BEFORE</span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full">AFTER</span>
      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full grid place-items-center shadow-lg text-slate-700">
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
