'use client';
import { useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function Counter({ to, suffix = '+' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      onUpdate: v => setVal(Math.floor(v)),
    });
    return controls.stop;
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString('en-IN')}{suffix}</span>;
}
