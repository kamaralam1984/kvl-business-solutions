'use client';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, User as UserIcon, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { navItems } from '@/lib/data/nav';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';
import { DesignSwitcher } from '@/components/studio/DesignSwitcher';
import { Roll } from '@/components/studio/Roll';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { megaMenus, type MegaMenuKey } from './header/megaMenuData';

// Everything below is genuinely non-critical for first paint (dropdowns,
// mobile nav panel, login-gated widgets) — deferred into their own chunks so
// the always-visible header shell (logo, primary nav, buttons) stays tiny.
const NotificationBell = dynamic(() => import('@/components/widgets/NotificationBell').then(m => m.NotificationBell), { ssr: false });
const MegaMenuPanel     = dynamic(() => import('./header/MegaMenuPanel').then(m => m.MegaMenuPanel), { ssr: false });
const UserMenuDropdown  = dynamic(() => import('./header/UserMenuDropdown').then(m => m.UserMenuDropdown), { ssr: false });
const MobileMenu        = dynamic(() => import('./header/MobileMenu').then(m => m.MobileMenu), { ssr: false });

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [userMenu, setUserMenu]   = useState(false);
  const [megaMenu, setMegaMenu]   = useState<MegaMenuKey | null>(null);
  const userMenuRef               = useRef<HTMLDivElement>(null);
  const accountBtnRef             = useRef<HTMLButtonElement>(null);
  const [hoverHref, setHoverHref] = useState<string | null>(null);
  const intentTimer               = useRef<ReturnType<typeof setTimeout>>();
  const reduce                    = useReducedMotion();

  // Hover-intent: open after a short dwell, close after a short grace period so
  // diagonal mouse moves toward the panel don't dismiss it.
  const openMega = useCallback((k: MegaMenuKey | null, delay: number) => {
    clearTimeout(intentTimer.current);
    intentTimer.current = setTimeout(() => setMegaMenu(k), delay);
  }, []);
  useEffect(() => () => clearTimeout(intentTimer.current), []);
  useEffect(() => { setMegaMenu(null); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Escape closes the account-menu dropdown and returns focus to its trigger,
  // matching standard menu-button keyboard behavior (no new a11y library).
  useEffect(() => {
    if (!userMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenu(false);
        accountBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [userMenu]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isAdmin = (session?.user as any)?.role === 'admin';
  const activeHref = navItems.find(i => pathname === i.href || (i.href !== '/' && pathname?.startsWith(i.href)))?.href ?? null;
  const pillHref = hoverHref ?? activeHref;

  return (
    <header className="site-header sticky top-0 z-50" data-scrolled={scrolled}>
      <div className="container flex items-center justify-between h-[68px]">

        {/* Logo — dark holder keeps the current logo readable in both themes until a transparent version is supplied */}
        <Link href="/" className="flex items-center group flex-shrink-0 rounded-btn focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]" aria-label="KVL Business Solutions — home">
          <span className="relative rounded-lg overflow-hidden shrink-0 bg-[#080910] transition-transform duration-base group-hover:scale-105 w-[138px] h-[43px] ring-1 ring-gold/40">
            <Image src="/brand-logo.png" alt="KVL Business Solutions" fill sizes="138px" className="object-cover" priority />
          </span>
        </Link>

        {/* Desktop nav with sliding active pill */}
        <nav aria-label="Primary" className="hidden lg:flex items-center" onMouseLeave={() => setHoverHref(null)}>
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            const megaKey = (item.label in megaMenus ? item.label : null) as MegaMenuKey | null;
            const pill = pillHref === item.href && (
              <motion.span layoutId="nav-pill" className="nav-pill" aria-hidden transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }} />
            );

            if (megaKey) {
              return (
                <div
                  key={item.href}
                  className="mm-anchor"
                  onMouseEnter={() => { setHoverHref(item.href); openMega(megaKey, 120); }}
                  onMouseLeave={() => openMega(null, 160)}
                  onFocus={() => { clearTimeout(intentTimer.current); setMegaMenu(megaKey); }}
                  onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) openMega(null, 0); }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') { clearTimeout(intentTimer.current); setMegaMenu(null); (e.currentTarget.querySelector('a.nav-link') as HTMLElement | null)?.focus(); }
                  }}
                >
                  <span className="relative inline-flex">
                    {pill}
                    <Link
                      href={item.href}
                      aria-haspopup="true"
                      aria-expanded={megaMenu === megaKey}
                      aria-current={isActive ? 'page' : undefined}
                      className="nav-link"
                    >
                      <Roll>{item.label}</Roll>
                      <ChevronDown className={cn('w-3 h-3 opacity-60 transition-transform duration-fast', megaMenu === megaKey && 'rotate-180')} aria-hidden />
                    </Link>
                  </span>
                  <MegaMenuPanel menuKey={megaKey} open={megaMenu === megaKey} />
                </div>
              );
            }

            return (
              <span key={item.href} className="relative inline-flex" onMouseEnter={() => setHoverHref(item.href)}>
                {pill}
                <Link href={item.href} aria-current={isActive ? 'page' : undefined} className="nav-link"><Roll>{item.label}</Roll></Link>
              </span>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <DesignSwitcher />
          <ThemeToggle />
          {session && <NotificationBell />}

          {session ? (
            <div className="relative ml-1" ref={userMenuRef}>
              <button
                ref={accountBtnRef}
                type="button"
                onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 min-h-[44px] transition-colors duration-fast hover:bg-text/5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={userMenu}
                aria-controls="account-menu-dropdown"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden shrink-0 border-[1.5px] border-gold/60">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold w-full h-full flex items-center justify-center text-text bg-bg3">
                      {session.user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                    </span>
                  )}
                </span>
                <ChevronDown className={cn('w-3 h-3 text-text/30 transition-transform duration-fast hidden md:block', userMenu && 'rotate-180')} aria-hidden />
              </button>
              <UserMenuDropdown session={session} isAdmin={isAdmin} open={userMenu} onClose={() => setUserMenu(false)} />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Button href="/login" variant="ghost" className="text-[13px]">Login</Button>
              <Button href="/book-demo" className="text-[13px] font-bold">Book a Strategy Call</Button>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl ml-1 text-text2 transition-colors duration-fast hover:text-text hover:bg-text/5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            id="mobile-menu-toggle"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <MobileMenu open={open} navItems={navItems} pathname={pathname} hasSession={!!session} onClose={() => setOpen(false)} />
    </header>
  );
}
