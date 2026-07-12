'use client';
import { useEffect, useState } from 'react';
import { Loader } from './Loader';

const VISIBLE_MS = 3000;

// Starts visible so it's part of the server-rendered HTML — it appears the
// instant the browser paints, before hydration or client JS finishes, which
// is what makes it show on a hard refresh / first load. Fixed 3s duration —
// brand moment on first load only, not repeated on every internal
// navigation (that per-click loader was removed for being pure overhead).
export function BootLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return <Loader fullscreen />;
}
