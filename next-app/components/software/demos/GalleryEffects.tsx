'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Renders src, falling back to `fallback` once if the primary crop URL ever fails to load —
// keeps every gallery/slider image "real" (a genuine photo) with zero risk of a broken icon.
function SafeImg({ src, fallback, alt, className, style }: { src: string; fallback: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => setCurrent(src), [src]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current} alt={alt} className={className} style={style}
      onError={() => { if (current !== fallback) setCurrent(fallback); }}
    />
  );
}

export type GalleryEffectKey = 'masonry' | 'carousel' | 'stagger' | 'mosaic' | 'polaroid';
export type SliderEffectKey = 'fadeScale' | 'slide' | 'kenburns' | 'wipe' | 'blur';

type GalleryProps = { effect: GalleryEffectKey; images: string[]; fallback: string; alt: string; accent: string };

export function EffectGallery({ effect, images, fallback, alt, accent }: GalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => trackRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });

  if (effect === 'masonry') {
    return (
      <div className="columns-2 sm:columns-3 gap-2.5 [column-fill:_balance]">
        {images.map((src, i) => (
          <motion.div key={src} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="mb-2.5 break-inside-avoid overflow-hidden rounded-lg">
            <SafeImg src={src} fallback={fallback} alt={alt} className="w-full object-cover transition-transform duration-500 hover:scale-110" style={{ aspectRatio: i % 3 === 0 ? '3/4' : '1/1' }} />
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'carousel') {
    return (
      <div className="relative">
        <div ref={trackRef} className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1" style={{ scrollbarWidth: 'none' }}>
          {images.map(src => (
            <div key={src} className="shrink-0 w-40 sm:w-48 snap-start overflow-hidden rounded-lg">
              <SafeImg src={src} fallback={fallback} alt={alt} className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
        <button onClick={() => scroll(-1)} className="absolute -left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow grid place-items-center text-slate-600 hidden sm:grid"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => scroll(1)} className="absolute -right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow grid place-items-center text-slate-600 hidden sm:grid"><ChevronRight className="w-4 h-4" /></button>
      </div>
    );
  }

  if (effect === 'mosaic') {
    return (
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((src, i) => (
          <motion.div
            key={src} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ rotate: i % 2 === 0 ? -2 : 2, scale: 1.05, zIndex: 10 }}
            className={`overflow-hidden rounded-lg shadow-md ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
          >
            <SafeImg src={src} fallback={fallback} alt={alt} className="w-full h-full object-cover aspect-square" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'polaroid') {
    const rotations = [-4, 3, -2, 5, -3, 2];
    return (
      <div className="flex flex-wrap justify-center gap-4 py-2">
        {images.map((src, i) => (
          <motion.div
            key={src} initial={{ opacity: 0, y: 20, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: rotations[i % rotations.length] }} viewport={{ once: true }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 10 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="bg-white p-2 pb-4 shadow-lg rounded-sm"
          >
            <SafeImg src={src} fallback={fallback} alt={alt} className="w-28 h-28 sm:w-32 sm:h-32 object-cover" />
          </motion.div>
        ))}
      </div>
    );
  }

  // stagger (default)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {images.map((src, i) => (
        <motion.div key={src} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.03 }} className="overflow-hidden rounded-lg ring-2 ring-transparent hover:ring-offset-0 transition-all" style={{ boxShadow: 'none' }} onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accent}`)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
          <SafeImg src={src} fallback={fallback} alt={alt} className="w-full aspect-square object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

type SliderProps = { effect: SliderEffectKey; images: string[]; fallback: string; alt: string; heightClass?: string };

export function EffectSlider({ effect, images, fallback, alt, heightClass = 'h-40 sm:h-56' }: SliderProps) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(0);
  useEffect(() => {
    setI(0);
    setPrev(0);
    const id = setInterval(() => setI(n => (n + 1) % images.length), 4200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|')]);
  useEffect(() => {
    const t = setTimeout(() => setPrev(i), 700);
    return () => clearTimeout(t);
  }, [i]);

  if (effect === 'kenburns') {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden shadow-lg`}>
        <AnimatePresence>
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <motion.div initial={{ scale: 1 }} animate={{ scale: 1.15 }} transition={{ duration: 4.2, ease: 'linear' }} className="w-full h-full">
              <SafeImg src={images[i]} fallback={fallback} alt={alt} className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <Dots count={images.length} active={i} onPick={setI} />
      </div>
    );
  }

  if (effect === 'wipe') {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden shadow-lg`}>
        <SafeImg src={images[prev]} fallback={fallback} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <motion.div key={i} className="absolute inset-0" initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }} animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} transition={{ duration: 0.7, ease: 'easeInOut' }}>
          <SafeImg src={images[i]} fallback={fallback} alt={alt} className="w-full h-full object-cover" />
        </motion.div>
        <Dots count={images.length} active={i} onPick={setI} />
      </div>
    );
  }

  if (effect === 'blur') {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden shadow-lg`}>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, filter: 'blur(14px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(14px)' }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <SafeImg src={images[i]} fallback={fallback} alt={alt} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <Dots count={images.length} active={i} onPick={setI} />
      </div>
    );
  }

  if (effect === 'slide') {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden shadow-lg`}>
        <AnimatePresence initial={false}>
          <motion.div key={i} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="absolute inset-0">
            <SafeImg src={images[i]} fallback={fallback} alt={alt} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <button onClick={() => setI(n => (n - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 grid place-items-center text-white transition z-10"><ChevronLeft className="w-3.5 h-3.5" /></button>
        <button onClick={() => setI(n => (n + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 grid place-items-center text-white transition z-10"><ChevronRight className="w-3.5 h-3.5" /></button>
        <Dots count={images.length} active={i} onPick={setI} />
      </div>
    );
  }

  // fadeScale (default)
  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden shadow-lg`}>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="absolute inset-0">
          <SafeImg src={images[i]} fallback={fallback} alt={alt} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <button onClick={() => setI(n => (n - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 grid place-items-center text-white transition z-10"><ChevronLeft className="w-3.5 h-3.5" /></button>
      <button onClick={() => setI(n => (n + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 grid place-items-center text-white transition z-10"><ChevronRight className="w-3.5 h-3.5" /></button>
      <Dots count={images.length} active={i} onPick={setI} />
    </div>
  );
}

function Dots({ count, active, onPick }: { count: number; active: number; onPick: (i: number) => void }) {
  if (count <= 1) return null;
  return (
    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
      {Array.from({ length: count }).map((_, idx) => (
        <button key={idx} onClick={() => onPick(idx)} className="p-1" aria-label={`Slide ${idx + 1}`}>
          <span className={`block rounded-full transition-all ${idx === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'}`} />
        </button>
      ))}
    </div>
  );
}
