'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, LayoutDashboard, Settings, Gift } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export function UserMenuDropdown({
  session, isAdmin, open, onClose,
}: {
  session: Session;
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Escape-to-close is also handled by the parent Header (which owns the
  // open state and returns focus to the trigger button); this local listener
  // covers the case where the dropdown itself has focus. Arrow keys move
  // focus between menu items, matching the roving-focus pattern used by
  // native <select>/menu widgets — no new a11y library dependency.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items || items.length === 0) return;
      const list = Array.from(items);
      const currentIndex = list.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        list[(currentIndex + 1 + list.length) % list.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        list[(currentIndex - 1 + list.length) % list.length]?.focus();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          id="account-menu-dropdown"
          role="menu"
          aria-label="Account menu"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="absolute right-0 top-full mt-2 z-50"
          style={{
            background: 'rgb(var(--bg-2))',
            border: '1px solid rgba(var(--border) / 0.08)',
            borderRadius: 14, padding: 8,
            minWidth: 230,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          }}
        >
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-3 mb-1"
            style={{ borderBottom: '1px solid rgba(var(--border) / 0.06)' }}>
            <span className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden shrink-0"
              style={{ border: '1.5px solid rgba(200,168,112,0.4)' }}>
              {session.user?.image ? (
                <Image src={session.user.image} alt="avatar" width={36} height={36} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold w-full h-full flex items-center justify-center" style={{ color: 'rgb(var(--text))', background: 'rgb(var(--bg-3))' }}>
                  {session.user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                </span>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'rgb(var(--text))' }}>
                {session.user?.name || 'User'}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'rgba(var(--text) / 0.4)' }}>
                {session.user?.email}
              </p>
            </div>
          </div>

          <div className="py-1">
            {[
              { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
              { href: '/dashboard/referrals', label: 'Referrals', Icon: Gift },
              { href: '/dashboard/settings', label: 'Settings', Icon: Settings },
              ...(isAdmin ? [{ href: '/admin', label: 'Admin Panel', Icon: LayoutDashboard }] : []),
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                tabIndex={0}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                style={{ color: 'rgba(var(--text) / 0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-1" style={{ borderTop: '1px solid rgba(var(--border) / 0.06)' }}>
            <button
              type="button"
              role="menuitem"
              tabIndex={0}
              onClick={() => { onClose(); signOut(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
              style={{ color: 'rgba(220,50,50,0.7)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(200,40,40)'; (e.currentTarget as HTMLElement).style.background = 'rgba(220,50,50,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(220,50,50,0.7)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <LogOut className="w-4 h-4 shrink-0" /> Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
