'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { navItems } from '@/lib/data/nav';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';
import { NotificationBell } from '@/components/widgets/NotificationBell';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [userMenu, setUserMenu]   = useState(false);
  const [megaMenu, setMegaMenu]   = useState<string | null>(null);
  const userMenuRef               = useRef<HTMLDivElement>(null);

  const megaMenus = {
    Services: {
      featured: {
        title: 'Custom ERP Software',
        desc: 'Built for your exact workflow',
        img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80&auto=format&fit=crop',
        href: '/software',
      },
      items: [
        { label: 'Software Development', desc: 'ERP, CRM, inventory systems', href: '/software', icon: '⬡' },
        { label: 'Website Development', desc: 'Fast, SEO-optimized sites', href: '/website-demos', icon: '◻' },
        { label: 'GPS Fleet Tracking', desc: 'Real-time vehicle management', href: '/services', icon: '◈' },
        { label: 'Industrial Automation', desc: 'IoT, CCTV, civil work', href: '/services', icon: '◉' },
        { label: 'CCTV & Security', desc: 'Surveillance solutions', href: '/services', icon: '◎' },
        { label: 'AI Business Tools', desc: 'Smart automation & insights', href: '/services', icon: '◈' },
      ],
    },
    Software: {
      featured: {
        title: 'School Management System',
        desc: 'Used by 200+ schools across India',
        img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80&auto=format&fit=crop',
        href: '/software',
      },
      items: [
        { label: 'ERP Software', desc: 'Enterprise resource planning', href: '/software', icon: '⬡' },
        { label: 'School Management', desc: 'Fee, attendance, reports', href: '/software', icon: '◻' },
        { label: 'Hospital Management', desc: 'Patient & billing system', href: '/software', icon: '◈' },
        { label: 'Restaurant POS', desc: 'Orders, KOT, inventory', href: '/software', icon: '◉' },
        { label: 'Hotel Management', desc: 'Booking & housekeeping', href: '/software', icon: '◎' },
        { label: 'Inventory & Billing', desc: 'GST-ready billing system', href: '/software', icon: '◈' },
      ],
    },
  };

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

  useEffect(() => { setOpen(false); }, [pathname]);

  const isAdmin = (session?.user as any)?.role === 'admin';

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(250,249,247,0.92)'
          : 'rgba(250,249,247,0.5)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(0,0,0,0.06)'
          : '1px solid rgba(0,0,0,0.03)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 24px rgba(0,0,0,0.06)'
          : 'none',
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
        <Link href="/" className="flex flex-col leading-none group flex-shrink-0">
          <span
            className="font-display font-black flex items-center"
            style={{ letterSpacing: '4px', fontSize: '20px', color: '#0a0a0a' }}
          >
            K
            <span style={{ color: '#c8a870', margin: '0 2px', fontSize: '7px', lineHeight: 1, opacity: 0.9 }}>◆</span>
            V
            <span style={{ color: '#c8a870', margin: '0 2px', fontSize: '7px', lineHeight: 1, opacity: 0.9 }}>◆</span>
            L
          </span>
          <span
            className="text-[6.5px] tracking-[3.5px] font-semibold uppercase mt-1"
            style={{ color: 'rgba(0,0,0,0.3)' }}
          >
            BUSINESS SOLUTIONS
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));
            const hasMega = !!megaMenus[item.label as keyof typeof megaMenus];
            if (hasMega) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaMenu(item.label)}
                  onMouseLeave={() => setMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex flex-col items-center',
                      isActive ? '' : ''
                    )}
                    style={{ color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.45)' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.45)'; }}
                  >
                    <span className="flex items-center gap-1">
                      {item.label}
                      <ChevronDown className={cn('w-3 h-3 opacity-50 transition-transform duration-200', megaMenu === item.label && 'rotate-180')} />
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        style={{
                          width: 4, height: 4,
                          borderRadius: '50%',
                          background: '#c8a870',
                          boxShadow: '0 0 8px rgba(200,168,112,0.5)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {megaMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 z-50 pt-2"
                        style={{ minWidth: 580 }}
                      >
                        <div style={{
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 16,
                          padding: 20,
                          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        }}>
                          <div className="grid grid-cols-[200px_1fr] gap-4">
                            {/* Featured card */}
                            <Link
                              href={megaMenus[item.label as keyof typeof megaMenus].featured.href}
                              className="rounded-xl overflow-hidden relative"
                              style={{ background: '#f4f3f1', border: '1px solid rgba(0,0,0,0.07)' }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={megaMenus[item.label as keyof typeof megaMenus].featured.img}
                                alt={megaMenus[item.label as keyof typeof megaMenus].featured.title}
                                style={{ width: '100%', height: 120, objectFit: 'cover', opacity: 0.85 }}
                              />
                              <div style={{ padding: '12px 14px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', lineHeight: 1.3 }}>
                                  {megaMenus[item.label as keyof typeof megaMenus].featured.title}
                                </div>
                                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>
                                  {megaMenus[item.label as keyof typeof megaMenus].featured.desc}
                                </div>
                              </div>
                            </Link>

                            {/* Items grid */}
                            <div className="grid grid-cols-2 gap-1">
                              {megaMenus[item.label as keyof typeof megaMenus].items.map(sub => (
                                <Link
                                  key={sub.href + sub.label}
                                  href={sub.href}
                                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150"
                                  style={{ color: 'rgba(0,0,0,0.45)' }}
                                  onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)';
                                    (e.currentTarget as HTMLElement).style.color = '#0a0a0a';
                                  }}
                                  onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.45)';
                                  }}
                                >
                                  <span style={{ fontSize: 16, color: '#c8a870', lineHeight: 1, marginTop: 1 }}>{sub.icon}</span>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'inherit', lineHeight: 1.2 }}>{sub.label}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{sub.desc}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex flex-col items-center',
                )}
                style={{ color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.45)' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.45)'; }}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: 4, height: 4,
                      borderRadius: '50%',
                      background: '#c8a870',
                      boxShadow: '0 0 8px rgba(200,168,112,0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          {session && <NotificationBell />}

          {/* Authenticated user */}
          {session ? (
            <div className="relative ml-1" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200"
                style={{ }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden shrink-0"
                  style={{ border: '1.5px solid rgba(200,168,112,0.6)', boxShadow: '0 0 12px rgba(200,168,112,0.12)' }}
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold w-full h-full flex items-center justify-center" style={{ color: '#0a0a0a', background: '#f0ede6' }}>
                      {session.user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn('w-3 h-3 transition-transform duration-200 hidden md:block', userMenu && 'rotate-180')}
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                />
              </button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute right-0 top-full mt-2 z-50"
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 14, padding: 8,
                      minWidth: 230,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                    }}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 px-3 py-3 mb-1"
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <span className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden shrink-0"
                        style={{ border: '1.5px solid rgba(200,168,112,0.4)' }}>
                        {session.user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold w-full h-full flex items-center justify-center" style={{ color: '#0a0a0a', background: '#f0ede6' }}>
                            {session.user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                          </span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: '#0a0a0a' }}>
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>
                          {session.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      {[
                        { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                        { href: '/settings',  label: 'Settings',  Icon: Settings },
                        ...(isAdmin ? [{ href: '/admin', label: 'Admin Panel', Icon: LayoutDashboard }] : []),
                      ].map(({ href, label, Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                          style={{ color: 'rgba(0,0,0,0.5)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <button
                        onClick={() => { setUserMenu(false); signOut(); }}
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
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                style={{ color: 'rgba(0,0,0,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; }}
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #c8a870 0%, #d4b880 100%)',
                  color: '#0a0a0a',
                  boxShadow: '0 4px 20px rgba(200,168,112,0.3)',
                }}
                onMouseEnter={e => {(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(200,168,112,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';}}
                onMouseLeave={e => {(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(200,168,112,0.3)'; (e.currentTarget as HTMLElement).style.transform = '';}}
              >
                Get Quote
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ml-1"
            style={{ color: 'rgba(0,0,0,0.4)' }}
            onClick={() => setOpen(v => !v)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close"
                  initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="menu"
                  initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: 'rgba(250,249,247,0.98)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
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
                        isActive
                          ? 'pl-3'
                          : 'border-transparent'
                      )}
                      style={{
                        color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.45)',
                        borderLeftColor: isActive ? '#c8a870' : undefined,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.45)'; }}
                    >
                      {item.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8a870' }} />}
                    </Link>
                  </motion.div>
                );
              })}

              {!session && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navItems.length * 0.04 + 0.06 }}
                  className="flex gap-3 mt-5 pt-5"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
                >
                  <Link href="/login"
                    className="flex-1 flex items-center justify-center py-3 rounded-xl text-[13px] font-medium border transition-all"
                    style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.5)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.12)'; }}
                  >
                    Login
                  </Link>
                  <Link href="/contact"
                    className="flex-1 flex items-center justify-center py-3 rounded-xl text-[13px] font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg, #c8a870, #d4b880)', color: '#0a0a0a' }}>
                    Get Quote
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
