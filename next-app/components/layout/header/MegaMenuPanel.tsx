'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { megaMenus, type MegaMenuKey } from './megaMenuData';

export function MegaMenuPanel({ menuKey, open }: { menuKey: MegaMenuKey; open: boolean }) {
  const menu = megaMenus[menuKey];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-0 z-50 pt-2"
          style={{ minWidth: menu.featured ? 580 : 360 }}
        >
          <div style={{
            background: 'rgb(var(--bg-2))',
            border: '1px solid rgba(var(--border) / 0.08)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
          }}>
            <div className={menu.featured ? 'grid grid-cols-[200px_1fr] gap-4' : ''}>
              {/* Featured card */}
              {menu.featured && (
                <Link
                  href={menu.featured.href}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'rgb(var(--bg-3))', border: '1px solid rgba(var(--border) / 0.07)' }}
                >
                  <div className="relative" style={{ width: '100%', height: 120 }}>
                    <Image
                      src={menu.featured.img}
                      alt={menu.featured.title}
                      fill
                      sizes="200px"
                      style={{ objectFit: 'cover', opacity: 0.85 }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(var(--text))', lineHeight: 1.3 }}>
                      {menu.featured.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(var(--text) / 0.4)', marginTop: 4 }}>
                      {menu.featured.desc}
                    </div>
                  </div>
                </Link>
              )}

              {/* Items grid */}
              <div className="grid grid-cols-2 gap-1">
                {menu.items.map(sub => (
                  <Link
                    key={sub.href + sub.label}
                    href={sub.href}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150"
                    style={{ color: 'rgba(var(--text) / 0.45)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.03)';
                      (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.45)';
                    }}
                  >
                    <span style={{ fontSize: 16, color: '#c8a870', lineHeight: 1, marginTop: 1 }}>{sub.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'inherit', lineHeight: 1.2 }}>{sub.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(var(--text) / 0.35)', marginTop: 2 }}>{sub.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
