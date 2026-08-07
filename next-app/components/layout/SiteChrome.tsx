'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DeferredBanner } from '@/components/layout/DeferredBanner';
import { DeferredWidgets } from '@/components/widgets/DeferredWidgets';
import { SmartCTA } from '@/components/shared/SmartCTA';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Standalone demo mini-sites (client-facing product showcases under /demo/*)
// render their own full-page chrome and must not show KVL's own header/footer/
// chat widgets — that would break the illusion of a real, separate product
// being demoed. The admin panel (/admin/*) has its own sidebar shell (see
// app/admin/layout.tsx) and must not get the public header/footer/chat
// widgets stacked underneath it either. /login and /register are standalone
// full-screen auth pages and should show nothing but the form itself.
// /dashboard/* is the logged-in user area — keeps the Header for
// navigation, but drops the marketing footer and floating
// chat/WhatsApp/call-back widgets.
// /get-quote and /website-offer are the two-step Independence Day ad funnel —
// each ships its own self-contained header/footer matching that campaign's
// design, so they render standalone here too (same treatment as /demo/*).
export function SiteChrome({
  children, settings, banner, cookieConsentEnabled,
}: {
  children: React.ReactNode; settings: any; banner: any; cookieConsentEnabled: boolean;
}) {
  const pathname = usePathname();
  const isStandaloneDemo = pathname?.startsWith('/demo/');
  const isAdmin = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdFunnel = pathname?.startsWith('/get-quote') || pathname?.startsWith('/website-offer');

  if (isStandaloneDemo || isAdmin || isAuthPage || isAdFunnel) {
    return <>{children}</>;
  }

  if (isDashboard) {
    return (
      <>
        <Header />
        <main>
          <DashboardShell>{children}</DashboardShell>
        </main>
      </>
    );
  }

  return (
    <>
      <DeferredBanner banner={banner} />
      <Header />
      <main>{children}</main>
      <SmartCTA />
      <Footer settings={settings} />
      <DeferredWidgets showCookieConsent={cookieConsentEnabled} />
    </>
  );
}
