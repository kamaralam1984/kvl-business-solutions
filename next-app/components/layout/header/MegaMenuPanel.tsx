'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Boxes, Handshake, Receipt, Package, MapPin, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { megaMenus, type MegaMenuKey } from './megaMenuData';

export const MENU_ICONS: Record<string, LucideIcon> = { Boxes, Handshake, Receipt, Package, MapPin, UtensilsCrossed };

const EASE = [0.22, 1, 0.36, 1] as const;

// One DOM for all four styles. The active style is the `data-menu-style`
// attribute on <html> (set before first paint); globals.css (.mm-*) lays the
// same markup out as floating / full-width / capsule-grid / side-panel.
// Hovering or focusing an item swaps the big preview (image, tag, blurb).
export function MegaMenuPanel({ menuKey, open }: { menuKey: MegaMenuKey; open: boolean }) {
  const menu = megaMenus[menuKey];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1); // -1 = featured product
  const glow = useRef<HTMLSpanElement>(null);

  if (!menu) return null;
  const item = active >= 0 ? menu.items[active] : null;
  const preview = item
    ? { key: item.href, img: item.img, title: item.label, text: item.blurb, tag: item.tag, href: item.href, c1: item.c1, c2: item.c2 }
    : menu.featured
      ? { key: 'featured', img: menu.featured.img, title: menu.featured.title, text: menu.featured.desc, tag: 'Featured', href: menu.featured.href, c1: '#c8a870', c2: '#8a6224' }
      : null;

  // Soft light that follows the pointer; moved with transform only.
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !glow.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    glow.current.style.transform = `translate3d(${e.clientX - r.left - 160}px, ${e.clientY - r.top - 160}px, 0)`;
  };

  return (
    <AnimatePresence onExitComplete={() => setActive(-1)}>
      {open && (
        <div className="mm-outer" data-mega-panel>
          <motion.div
            className="mm-card"
            onPointerMove={onMove}
            initial={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.99 }}
            transition={{ duration: reduce ? 0 : 0.26, ease: EASE }}
          >
            <span ref={glow} className="mm-glow" aria-hidden />
            <div className="mm-body">
              <ul className="mm-items" role="list">
                {menu.items.map((sub, i) => {
                  const Icon = MENU_ICONS[sub.icon];
                  return (
                    <motion.li
                      key={sub.href}
                      initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: reduce ? 0 : 0.28, ease: EASE, delay: reduce ? 0 : 0.05 + i * 0.045 }}
                    >
                      <Link
                        href={sub.href}
                        className="mm-item"
                        data-active={active === i}
                        style={{ '--c1': sub.c1, '--c2': sub.c2 } as React.CSSProperties}
                        onPointerEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                      >
                        <span className="mm-thumb" aria-hidden>
                          <Image src={sub.img} alt="" fill sizes="200px" className="object-cover" />
                        </span>
                        <span className="mm-icon">{Icon && <Icon className="h-[18px] w-[18px]" aria-hidden />}</span>
                        <span className="mm-text">
                          <span className="mm-item-title">{sub.label}</span>
                          <span className="mm-item-desc">{sub.desc}</span>
                        </span>
                        <ArrowRight className="mm-arrow h-4 w-4" aria-hidden />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {preview && (
                <Link
                  href={preview.href}
                  className="mm-preview"
                  tabIndex={-1}
                  aria-hidden
                  style={{ '--c1': preview.c1, '--c2': preview.c2 } as React.CSSProperties}
                >
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={preview.key}
                      className="mm-preview-layer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                    >
                      <Image src={preview.img} alt="" fill sizes="340px" className="mm-kb object-cover" />
                      <span className="mm-preview-shade" />
                      {!reduce && (
                        <motion.span
                          className="mm-shine"
                          initial={{ x: '-130%' }}
                          animate={{ x: '130%' }}
                          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                        />
                      )}
                      <span className="mm-preview-copy">
                        <span className="mm-tag">{preview.tag}</span>
                        <span className="mm-preview-title">{preview.title}</span>
                        <span className="mm-preview-text">{preview.text}</span>
                        <span className="mm-cta">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </Link>
              )}
            </div>

            {menu.allHref && (
              <Link href={menu.allHref} className="mm-all">
                {menu.allLabel} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
