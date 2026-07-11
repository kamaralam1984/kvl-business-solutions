'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DeferredBanner } from '@/components/layout/DeferredBanner';
import { DeferredWidgets } from '@/components/widgets/DeferredWidgets';

// Standalone demo mini-sites (client-facing product showcases under /demo/*)
// render their own full-page chrome and must not show KVL's own header/footer/
// chat widgets — that would break the illusion of a real, separate product
// being demoed.
export function SiteChrome({
  children, settings, banner, cookieConsentEnabled,
}: {
  children: React.ReactNode; settings: any; banner: any; cookieConsentEnabled: boolean;
}) {
  const pathname = usePathname();
  const isStandaloneDemo = pathname?.startsWith('/demo/');

  if (isStandaloneDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <DeferredBanner banner={banner} />
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
      <DeferredWidgets showCookieConsent={cookieConsentEnabled} />
    </>
  );
}
