'use client';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, User as UserIcon, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { navItems } from '@/lib/data/nav';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';
import { cn } from '@/lib/utils';
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

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(var(--bg-2) / 0.92)' : 'rgba(var(--bg-2) / 0.5)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(var(--border) / 0.06)' : '1px solid rgba(var(--border) / 0.03)',
        boxShadow: scrolled ? '0 1px 0 rgba(var(--border) / 0.08) inset, 0 4px 24px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Top gold line */}
      <div style={{
        position: 'absolute', top: 0, insetInline: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(200,168,112,0.25) 30%, rgba(200,168,112,0.45) 50%, rgba(200,168,112,0.25) 70%, transparent 100%)',
        opacity: scrolled ? 0.9 : 0.6,
        transition: 'opacity 0.5s ease',
      }} />

      <div className="container flex items-center justify-between" style={{ height: 68 }}>

        {/* Logo */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <span
            className="relative rounded-lg overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{ width: 138, height: 43, boxShadow: '0 0 0 1px rgba(200,168,112,0.35), 0 2px 10px rgba(0,0,0,0.15)' }}
          >
            <Image src="/brand-logo.png" alt="KVL Business Solutions" fill sizes="138px" className="object-cover" priority />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            const megaKey = (item.label in megaMenus ? item.label : null) as MegaMenuKey | null;

            if (megaKey) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaMenu(megaKey)}
                  onMouseLeave={() => setMegaMenu(null)}
                  onFocus={() => setMegaMenu(megaKey)}
                  onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMegaMenu(null); }}
                  onKeyDown={e => { if (e.key === 'Escape') setMegaMenu(null); }}
                >
                  <Link
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={megaMenu === megaKey}
                    className="relative px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex flex-col items-center"
                    style={{ color: isActive ? 'rgb(var(--text))' : 'rgb(var(--text-2))' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-2))'; }}
                  >
                    <span className="flex items-center gap-1">
                      {item.label}
                      <ChevronDown className={cn('w-3 h-3 opacity-50 transition-transform duration-200', megaMenu === megaKey && 'rotate-180')} />
                    </span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                        style={{ width: 4, height: 4, background: '#c8a870', boxShadow: '0 0 8px rgba(200,168,112,0.5)' }}
                      />
                    )}
                  </Link>

                  <MegaMenuPanel menuKey={megaKey} open={megaMenu === megaKey} />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex flex-col items-center"
                style={{ color: isActive ? 'rgb(var(--text))' : 'rgb(var(--text-2))' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-2))'; }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ width: 4, height: 4, background: '#c8a870', boxShadow: '0 0 8px rgba(200,168,112,0.5)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">

          <ThemeToggle />

          {session && <NotificationBell />}

          {session ? (
            <div className="relative ml-1" ref={userMenuRef}>
              <button
                ref={accountBtnRef}
                type="button"
                onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={userMenu}
                aria-controls="account-menu-dropdown"
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden shrink-0"
                  style={{ border: '1.5px solid rgba(200,168,112,0.6)', boxShadow: '0 0 12px rgba(200,168,112,0.12)' }}
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold w-full h-full flex items-center justify-center" style={{ color: 'rgb(var(--text))', background: 'rgb(var(--bg-3))' }}>
                      {session.user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn('w-3 h-3 transition-transform duration-200 hidden md:block', userMenu && 'rotate-180')}
                  style={{ color: 'rgba(var(--text) / 0.3)' }}
                />
              </button>

              <UserMenuDropdown session={session} isAdmin={isAdmin} open={userMenu} onClose={() => setUserMenu(false)} />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                style={{ color: 'rgb(var(--text-2))' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-2))'; }}
              >
                Login
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #c8a870 0%, #d4b880 100%)', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(200,168,112,0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(200,168,112,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(200,168,112,0.3)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                Book a Strategy Call
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ml-1"
            style={{ color: 'rgb(var(--text-2))' }}
            onClick={() => setOpen(v => !v)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-2))'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
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
