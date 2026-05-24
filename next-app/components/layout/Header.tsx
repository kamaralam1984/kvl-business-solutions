'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Settings, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { navItems } from '@/lib/data/nav';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';
import { NotificationBell } from '@/components/widgets/NotificationBell';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all border-b border-tint backdrop-blur-xl',
      scrolled ? 'shadow-card' : ''
    )}
    style={{ background: 'rgb(var(--bg-2) / 0.7)' }}>
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display font-black text-2xl tracking-[2px] flex items-center gap-0.5 gradient-text">
            K<span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />V<span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />L
          </span>
          <span className="text-[9px] tracking-[3px] text-text2 mt-1 font-semibold">BUSINESS SOLUTIONS</span>
        </Link>

        <nav className="hidden lg:flex gap-7 items-center">
          {navItems.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'text-sm font-medium relative transition-colors',
                pathname === n.href ? 'text-text' : 'text-text2 hover:text-text'
              )}
            >
              {n.label}
              {pathname === n.href && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/search" className="p-2 text-text2 hover:text-text transition-colors" aria-label="Search"><Search className="w-5 h-5" /></Link>
          {session?.user && <NotificationBell />}
          <ThemeToggle />
          {session?.user ? (
            <div className="relative">
              <button onClick={() => setUserMenu(!userMenu)} className="w-9 h-9 rounded-full bg-primary/15 grid place-items-center text-primary font-bold hover:bg-primary/25" aria-label="Account">
                {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
              </button>
              {userMenu && (
                <div className="absolute right-0 top-12 w-56 card-base p-2 shadow-card text-sm" onMouseLeave={() => setUserMenu(false)}>
                  <div className="px-3 py-2 border-b border-tint mb-1">
                    <div className="font-semibold truncate">{session.user.name || 'User'}</div>
                    <div className="text-xs text-text2 truncate">{session.user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                  <Link href="/dashboard/settings" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10"><Settings className="w-4 h-4" /> Settings</Link>
                  {(session.user as any).role === 'admin' && (
                    <Link href="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-primary font-semibold"><UserIcon className="w-4 h-4" /> Admin Panel</Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 w-full text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-text2 hover:text-text">Login</Link>
          )}
          <Link href="/contact" className="hidden sm:inline-flex btn btn-primary">Get A Quote</Link>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-tint overflow-hidden"
            style={{ background: 'rgb(var(--bg-2))' }}
          >
            <div className="container py-4 flex flex-col gap-2">
              {navItems.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium',
                    pathname === n.href ? 'text-text surface-tint' : 'text-text2'
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
