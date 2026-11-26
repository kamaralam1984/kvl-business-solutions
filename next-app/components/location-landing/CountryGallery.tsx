'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export function CountryGallery({ images, countryName }: { images: string[]; countryName: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setOpen(i)}
            aria-label={`View work delivered for clients in ${countryName} ${i + 1}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-card border border-line shadow-soft-1 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <Image
              src={src}
              alt={`Work delivered for clients in ${countryName} ${i + 1}`}
              fill
              className="object-cover transition-transform duration-slow ease-brand motion-reduce:transition-none group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-base group-hover:bg-black/20" aria-hidden />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 grid place-items-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${countryName} project screenshot`}
          onClick={() => setOpen(null)}
        >
          <button aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-btn text-white/80 hover:text-white focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            <X className="h-7 w-7" aria-hidden />
          </button>
          <div className="relative max-w-4xl w-full aspect-[4/3]" onClick={e => e.stopPropagation()}>
            <Image src={images[open]} alt={`${countryName} project screenshot`} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
