'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { megaMenus, type MegaMenuKey } from './megaMenuData';

export function MobileMenu({
  open, navItems, pathname, hasSession, onClose,
}: {
  open: boolean;
  navItems: readonly { label: string; href: string }[];
  pathname: string | null;
  hasSession: boolean;
  onClose: () => void;
}) {
  // Which mega-menu (if any) is expanded in the mobile accordion — desktop
  // reveals these on hover, mobile has no hover, so this is the mobile-only
  // way to reach the sub-pages (Software & Website's product list) at all.
  const [expanded, setExpanded] = useState<MegaMenuKey | null>(null);
  // Same Escape-to-close + focus-return pattern as the account-menu dropdown
  // elsewhere in Header.tsx — this mobile nav panel was the one interactive
  // overlay on the page without it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        document.getElementById('mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden overflow-hidden"
          style={{
            background: 'rgba(var(--bg-2) / 0.98)',
            borderTop: '1px solid rgba(var(--border) / 0.06)',
          }}
        >
          <nav className="container py-4 flex flex-col">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const megaKey = (item.label in megaMenus ? item.label : null) as MegaMenuKey | null;
              const menu = megaKey ? megaMenus[megaKey] : null;
              const isExpanded = megaKey !== null && expanded === megaKey;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <div
                    className={cn(
                      'flex items-center justify-between h-12 px-1 border-l-2',
                      isActive ? 'pl-3' : 'border-transparent'
                    )}
                    style={{
                      borderLeftColor: isActive ? '#c8a870' : undefined,
                      borderBottom: isExpanded ? 'none' : '1px solid rgba(var(--border) / 0.05)',
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex-1 flex items-center gap-2 text-[14px] font-medium transition-all duration-200"
                      style={{ color: isActive ? 'rgb(var(--text))' : 'rgb(var(--text-2))' }}
                    >
                      {item.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8a870' }} />}
                    </Link>
                    {menu && (
                      <button
                        type="button"
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                        aria-expanded={isExpanded}
                        onClick={() => setExpanded(isExpanded ? null : megaKey)}
                        className="flex items-center justify-center w-9 h-9 -mr-1 shrink-0"
                        style={{ color: 'rgba(var(--text) / 0.5)' }}
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {menu && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                        style={{ borderBottom: '1px solid rgba(var(--border) / 0.05)' }}
                      >
                        <div className="flex flex-col pb-2 pl-4">
                          {menu.featured && (
                            <Link
                              href={menu.featured.href}
                              onClick={onClose}
                              className="text-[13.5px] py-2"
                              style={{ color: 'rgb(var(--text))', fontWeight: 600 }}
                            >
                              {menu.featured.title}
                            </Link>
                          )}
                          {menu.items.map(sub => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onClose}
                              className="text-[13.5px] py-2"
                              style={{ color: 'rgb(var(--text-2))' }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {!hasSession && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navItems.length * 0.04 + 0.06 }}
                className="flex gap-3 mt-5 pt-5"
                style={{ borderTop: '1px solid rgba(var(--border) / 0.07)' }}
              >
                <Link href="/login"
                  className="flex-1 flex items-center justify-center py-3 rounded-xl text-[13px] font-medium border transition-all"
                  style={{ borderColor: 'rgba(var(--border) / 0.12)', color: 'rgba(var(--text) / 0.5)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.12)'; }}
                >
                  Login
                </Link>
                <Link href="/book-demo"
                  className="flex-1 flex items-center justify-center py-3 rounded-xl text-[13px] font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, #c8a870, #d4b880)', color: '#0a0a0a' }}>
                  Book a Strategy Call
                </Link>
              </motion.div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
