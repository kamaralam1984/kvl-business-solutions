'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, HeartHandshake, Sparkles, Gift, Building2,
  Settings, LogOut, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Overview & Orders', Icon: LayoutDashboard },
  { href: '/dashboard/crm', label: 'CRM Pipeline', Icon: HeartHandshake },
  { href: '/dashboard/analytics', label: 'AI Analytics', Icon: Sparkles },
  { href: '/dashboard/referrals', label: 'Referrals', Icon: Gift },
  { href: '/dashboard/franchise', label: 'Franchise', Icon: Building2 },
  { href: '/dashboard/settings', label: 'Settings', Icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  // Sidebar starts collapsed on small screens so it doesn't eat the viewport.
  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
  }, []);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="flex items-start gap-5">
        <AnimatePresence initial={false} mode="wait">
          {open && (
            <motion.aside
              key="sidebar"
              initial={{ x: -40, opacity: 0, width: 0 }}
              animate={{ x: 0, opacity: 1, width: 240 }}
              exit={{ x: -40, opacity: 0, width: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 sticky overflow-hidden"
              style={{ top: 92 }}
            >
              <div className="relative flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(200,168,112,0.9)' }}>
                  Dashboard
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ color: 'rgba(var(--text-2) / 1)' }}
                  aria-label="Hide sidebar"
                  title="Hide sidebar"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              <nav className="relative space-y-1">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={l.href}
                        className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200"
                        style={{ color: active ? '#c8a96e' : 'rgb(var(--text-2))' }}
                      >
                        {active && (
                          <motion.span
                            layoutId="dashboard-active-pill"
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background: 'rgba(200,168,112,0.1)',
                              border: '1px solid rgba(200,168,112,0.25)',
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <l.Icon className="w-4 h-4 shrink-0 relative" />
                        <span className="relative">{l.label}</span>
                        {active && (
                          <motion.span
                            layoutId="dashboard-active-dot"
                            className="w-1.5 h-1.5 rounded-full ml-auto relative shrink-0"
                            style={{ background: '#c8a870', boxShadow: '0 0 8px rgba(200,168,112,0.6)' }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="relative mt-3 pt-3" style={{ borderTop: '1px solid rgba(var(--border) / 0.07)' }}>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200"
                  style={{ color: 'rgba(220,60,60,0.75)' }}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Logout
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
            className="sticky shrink-0 flex items-center justify-center"
            style={{ top: 92, width: 32, height: 32 }}
            aria-label="Show sidebar"
            title="Show sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" style={{ color: '#c8a96e' }} />
          </motion.button>
        )}

        <motion.div
          layout
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-w-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
