'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL = 'main h3, main h1:not(.sx-split), main h2:not(.sx-split), main .eyebrow, main .rounded-card, main .rounded-panel';

// Everything that only exists in the Studio design: grain, scroll progress bar,
// and scroll-in reveals. Renders nothing in Classic.
export function StudioFX() {
  const [on, setOn] = useState(false);
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const sync = () => setOn(document.documentElement.hasAttribute('data-fx'));
    sync();
    window.addEventListener('kvl:design', sync);
    return () => window.removeEventListener('kvl:design', sync);
  }, []);

  // page-transition wipe: a lime panel covers the new page, then slides away
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = wipe.current;
    if (!el) return;
    el.classList.remove('sx-wipe-run');
    void el.offsetWidth;
    el.classList.add('sx-wipe-run');
  }, [pathname, on]);

  // scroll progress bar (transform only)
  useEffect(() => {
    if (!on) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [on]);

  // text effects + scroll-in reveals; re-scans after navigation
  useEffect(() => {
    if (!on) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const host = e.target as HTMLElement;
        // images are observed via their parent (a fully clipped element never counts as visible)
        if (host.dataset.sxImgHost) host.querySelectorAll(':scope > .sx-img').forEach(i => i.classList.add('sx-in'));
        else host.classList.add('sx-in');
        io.unobserve(host);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    let t2: ReturnType<typeof setTimeout>;
    let ready = false;
    // Only classes are added here (never markup): split headings and text-rolls are rendered by React.
    const scan = () => {
      ready = true;
      document.querySelectorAll<HTMLElement>('.sx-split').forEach(el => {
        if (el.dataset.sxSplit || el.closest('.sx-only, [data-sx-skip]')) return;
        el.dataset.sxSplit = '1'; io.observe(el);
      });
      document.querySelectorAll<HTMLElement>(REVEAL).forEach(el => {
        if (el.dataset.sx) return;
        el.dataset.sx = '1'; el.classList.add('sx-rv'); io.observe(el);
      });
      // large content images: clipped wipe-in + settle. Carousels, header/footer and tiny logos are skipped.
      document.querySelectorAll<HTMLImageElement>('main img[data-nimg]').forEach(img => {
        if (img.dataset.sxImg || img.closest('[aria-roledescription="carousel"], .sx-only, [data-sx-skip], header, footer')) return;
        const r = img.getBoundingClientRect();
        if (r.width < 160 || r.height < 100) return;
        img.dataset.sxImg = '1'; img.classList.add('sx-img');
        const host = img.parentElement; if (host) { host.dataset.sxImgHost = '1'; io.observe(host); }
      });
    };
    // wait until the page has finished loading (and hydrating) before touching any element
    let t: ReturnType<typeof setTimeout>;
    const start = () => { t = setTimeout(scan, 900); };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    const mo = new MutationObserver(() => { if (!ready) return; clearTimeout(t2); t2 = setTimeout(scan, 120); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('load', start); clearTimeout(t); clearTimeout(t2); mo.disconnect(); io.disconnect();
      document.querySelectorAll<HTMLElement>('[data-sx-split]').forEach(el => { el.classList.remove('sx-in'); delete el.dataset.sxSplit; });
      document.querySelectorAll<HTMLElement>('[data-sx]').forEach(el => { el.classList.remove('sx-rv', 'sx-in'); delete el.dataset.sx; });
      document.querySelectorAll<HTMLElement>('[data-sx-img]').forEach(el => { el.classList.remove('sx-img', 'sx-in'); delete el.dataset.sxImg; });
      document.querySelectorAll<HTMLElement>('[data-sx-img-host]').forEach(el => { delete el.dataset.sxImgHost; });
    };
  }, [on, pathname]);

  // scroll-driven word lighting for the big statement (sets --p 0..1 on each .sx-big)
  useEffect(() => {
    if (!on) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sx-big'));
    if (!els.length) return;
    const update = () => {
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
        el.style.setProperty('--p', p.toFixed(3));
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [on, pathname]);

  if (!on) return null;
  return (
    <>
      <div ref={bar} className="sx-progress" aria-hidden />
      <div className="sx-grain" aria-hidden />
      <div ref={wipe} className="sx-wipe" aria-hidden />
    </>
  );
}
