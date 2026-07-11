'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MobileMenu({
  open, navItems, pathname, hasSession,
}: {
  open: boolean;
  navItems: { label: string; href: string }[];
  pathname: string | null;
  hasSession: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
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
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between text-[14px] font-medium transition-all duration-200 h-12 px-1 border-l-2',
                      isActive ? 'pl-3' : 'border-transparent'
                    )}
                    style={{
                      color: isActive ? 'rgb(var(--text))' : 'rgba(var(--text) / 0.45)',
                      borderLeftColor: isActive ? '#c8a870' : undefined,
                      borderBottom: '1px solid rgba(var(--border) / 0.05)',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.45)'; }}
                  >
                    {item.label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8a870' }} />}
                  </Link>
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
                <Link href="/contact"
                  className="flex-1 flex items-center justify-center py-3 rounded-xl text-[13px] font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, #c8a870, #d4b880)', color: '#0a0a0a' }}>
                  Book a Call
                </Link>
              </motion.div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
