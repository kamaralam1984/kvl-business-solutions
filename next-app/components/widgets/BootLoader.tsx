'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader } from './Loader';

const VISIBLE_MS = 1500;

// Starts visible so it's part of the server-rendered HTML — it appears the
// instant the browser paints, before hydration or client JS finishes, which
// is what makes it show on a hard refresh / first load. Fixed 3s duration —
// brand moment on first load only, not repeated on every internal
// navigation (that per-click loader was removed for being pure overhead).
export function BootLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  // /login and /register are standalone auth pages (see SiteChrome) that
  // should be tappable immediately — on a slow mobile connection, hydration
  // alone can take longer than VISIBLE_MS, so this fullscreen, opaque,
  // un-dismissable overlay was sitting on top of the Sign In button and
  // swallowing taps for several seconds after a direct/fresh load.
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  if (isAuthPage || !visible) return null;
  return <Loader fullscreen />;
}
