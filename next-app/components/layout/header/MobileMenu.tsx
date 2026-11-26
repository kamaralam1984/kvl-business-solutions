'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { megaMenus, type MegaMenuKey } from './megaMenuData';

const PHONE = '+919942000413';

// Full-height drawer: same layout for every menu style (only the entry
// animation in globals.css varies). Accordions for sub-menus, fixed call button.
export function MobileMenu({
  open, navItems, pathname, hasSession, onClose,
}: {
  open: boolean;
  navItems: readonly { label: string; href: string }[];
  pathname: string | null;
  hasSession: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<MegaMenuKey | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        document.getElementById('mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    // Lock page scroll behind the drawer.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  // Portal: the sticky header's backdrop-filter would otherwise be the containing
  // block for this fixed drawer and shrink it to the header's height.
  return createPortal(
    <div id="mobile-nav-menu" className="m-drawer lg:hidden" role="dialog" aria-label="Menu">
      <nav aria-label="Mobile" className="container flex-1 overflow-y-auto py-3">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const megaKey = (item.label in megaMenus ? item.label : null) as MegaMenuKey | null;
          const menu = megaKey ? megaMenus[megaKey] : null;
          const isExpanded = megaKey !== null && expanded === megaKey;
          return (
            <div key={item.href} className="border-b border-line">
              <div className="flex items-center justify-between min-h-[52px]">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn('flex-1 flex items-center gap-2 min-h-[44px] text-[15px] font-medium transition-colors duration-fast', isActive ? 'text-text' : 'text-text2')}
                >
                  {item.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden />}
                </Link>
                {menu && (
                  <button
                    type="button"
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                    aria-expanded={isExpanded}
                    onClick={() => setExpanded(isExpanded ? null : megaKey)}
                    className="grid place-items-center w-11 h-11 shrink-0 text-text2 rounded-btn focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                  >
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-base', isExpanded && 'rotate-180')} aria-hidden />
                  </button>
                )}
              </div>
              {menu && (
                <div className={cn('grid transition-[grid-template-rows] duration-base ease-brand', isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col pb-3 pl-3">
                      {menu.items.map(sub => (
                        <Link key={sub.href} href={sub.href} onClick={onClose} tabIndex={isExpanded ? 0 : -1} className="min-h-[44px] flex items-center text-[14px] text-text2 hover:text-text">
                          {sub.label}
                        </Link>
                      ))}
                      {menu.allHref && (
                        <Link href={menu.allHref} onClick={onClose} tabIndex={isExpanded ? 0 : -1} className="min-h-[44px] flex items-center text-[14px] font-semibold text-gold-text">
                          {menu.allLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!hasSession && (
          <div className="flex gap-3 mt-5">
            <Button href="/login" variant="secondary" onClick={onClose} className="flex-1">Login</Button>
            <Button href="/book-demo" onClick={onClose} className="flex-1 font-bold">Book a Strategy Call</Button>
          </div>
        )}
      </nav>
      <div className="border-t border-line bg-card p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button href={`tel:${PHONE}`} variant="primary" size="lg" className="w-full">
          <Phone className="w-4 h-4" aria-hidden /> Call us now
        </Button>
      </div>
    </div>,
    document.body,
  );
}
