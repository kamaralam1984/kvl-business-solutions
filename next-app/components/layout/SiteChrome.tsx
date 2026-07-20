'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DeferredBanner } from '@/components/layout/DeferredBanner';
import { DeferredWidgets } from '@/components/widgets/DeferredWidgets';
import { SmartCTA } from '@/components/shared/SmartCTA';

// Standalone demo mini-sites (client-facing product showcases under /demo/*)
// render their own full-page chrome and must not show KVL's own header/footer/
// chat widgets — that would break the illusion of a real, separate product
// being demoed. The admin panel (/admin/*) has its own sidebar shell (see
// app/admin/layout.tsx) and must not get the public header/footer/chat
// widgets stacked underneath it either. /login is a standalone full-screen
// auth page and should show nothing but the login form. /dashboard/* is the
// logged-in user area — keeps the Header for navigation, but drops the
// marketing footer and floating chat/WhatsApp/call-back widgets.
export function SiteChrome({
  children, settings, banner, cookieConsentEnabled,
}: {
  children: React.ReactNode; settings: any; banner: any; cookieConsentEnabled: boolean;
}) {
  const pathname = usePathname();
  const isStandaloneDemo = pathname?.startsWith('/demo/');
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname?.startsWith('/login');
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isStandaloneDemo || isAdmin || isLogin) {
    return <>{children}</>;
  }

  if (isDashboard) {
    return (
      <>
        <Header />
        <main>{children}</main>
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
