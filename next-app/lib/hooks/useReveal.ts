'use client';
import { useEffect, useRef, useState } from 'react';

// Lightweight replacement for framer-motion's `useInView` + `motion.div`
// fade/slide-up-on-scroll pattern used across the homepage sections — plain
// IntersectionObserver + CSS transition, so those sections don't need to
// ship the framer-motion runtime just for a one-time entrance animation.
export function useReveal(margin = '-60px') {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}

// Inline style for a staggered fade/slide-up item — pass the item's index
// and the section's `inView` flag. `durationMs` and `distance` mirror the
// framer-motion variants this replaces (ease matches framer's [0.22,1,0.36,1]).
export function revealStyle(inView: boolean, index = 0, opts?: { staggerMs?: number; durationMs?: number; distance?: number }) {
  const { staggerMs = 70, durationMs = 550, distance = 24 } = opts || {};
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity ${durationMs}ms cubic-bezier(0.22,1,0.36,1), transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1)`,
    transitionDelay: inView ? `${index * staggerMs}ms` : '0ms',
  } as const;
}
