'use client';
import { useEffect, useState } from 'react';
import { Loader } from './Loader';

const MIN_VISIBLE_MS = 700;

// Starts visible so it's part of the server-rendered HTML — it appears the
// instant the browser paints, before hydration or client JS finishes, which
// is what makes it show on a hard refresh / first load (not just client-side
// navigation, which RouteLoader already covers).
export function BootLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return <Loader fullscreen />;
}
