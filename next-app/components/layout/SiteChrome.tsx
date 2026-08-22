'use client';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DeferredBanner } from '@/components/layout/DeferredBanner';
import { DeferredWidgets } from '@/components/widgets/DeferredWidgets';
import { SmartCTA } from '@/components/shared/SmartCTA';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Was previously loaded unconditionally in app/layout.tsx, so it ran on
// every route — including /admin, /login, /demo/*, and the maintenance-mode
// HTML — none of which can ever open it. Scoped here to only the branches
// that render chat-capable chrome, and gated on the same chatbotEnabled flag
// as the in-house Chatbot bubble.
function ChatWidgetScript({ chatbotEnabled }: { chatbotEnabled: boolean }) {
  if (!chatbotEnabled) return null;
  return (
    <Script
      src={process.env.NEXT_PUBLIC_CHATBOT_WIDGET_URL || 'https://superai.kvlbusinesssolutions.com/widget.js'}
      strategy="lazyOnload"
    />
  );
}

// Just the chat bubble (not the full FloatingWidgets bundle — exit-intent
// popup, quote/lead-magnet modals, etc. would compete with the funnel's own
// single-purpose form) for the ad-funnel pages below.
const Chatbot = dynamic(() => import('@/components/widgets/Chatbot').then(m => m.Chatbot), { ssr: false });
// VipTracker renders no UI (returns null) — it's the silent visit/session
// recorder behind Admin > Landing Page Analytics, not one of the popups
// excluded above. Without it, /get-quote and /website-offer — the two pages
// every ad-funnel click actually lands on — were invisible to that dashboard.
const VipTracker = dynamic(() => import('@/components/vip/VipTracker').then(m => m.VipTracker), { ssr: false });
// Every tracker on the site (VipTracker above, plus Meta Pixel/GA4/Google Ads/
// LinkedIn in app/layout.tsx) stays silent until `kvl_consent` is set, and
// this banner is the ONLY thing that sets it. It was never rendered on the
// ad-funnel pages, so a cold visitor arriving straight from the Facebook ad
// (the normal case — that's the whole point of the ad) was never asked, and
// every tracker — ours and Meta's own conversion pixel — stayed dark for them.
const CookieConsent = dynamic(() => import('@/components/widgets/CookieConsent').then(m => m.CookieConsent), { ssr: false });

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
// /get-quote and /website-offer are the two-step website ad funnel —
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
  const chatbotEnabled = settings?.features?.chatbot !== false;

  if (isStandaloneDemo || isAdmin || isAuthPage) {
    return <>{children}</>;
  }

  if (isAdFunnel) {
    return (
      <>
        {children}
        <VipTracker />
        {cookieConsentEnabled && <CookieConsent />}
        {/* Same desktop/mobile split as FloatingWidgets.tsx — on mobile the
            cookie banner spans bottom-4 left-4 right-4, so the bubble is
            raised to bottom-16 there instead of sharing that same strip. */}
        {chatbotEnabled && (
          <>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] hidden md:flex">
              <Chatbot />
            </div>
            <div className="fixed bottom-16 right-4 z-[99] flex md:hidden">
              <Chatbot />
            </div>
          </>
        )}
        <ChatWidgetScript chatbotEnabled={chatbotEnabled} />
      </>
    );
  }

  if (isDashboard) {
    return (
      <>
        <Header />
        <main id="main-content">
          <DashboardShell>{children}</DashboardShell>
        </main>
        <ChatWidgetScript chatbotEnabled={chatbotEnabled} />
      </>
    );
  }

  return (
    <>
      <DeferredBanner banner={banner} />
      <Header />
      <main id="main-content">{children}</main>
      <SmartCTA />
      <Footer settings={settings} />
      <DeferredWidgets showCookieConsent={cookieConsentEnabled} chatbotEnabled={chatbotEnabled} />
      <ChatWidgetScript chatbotEnabled={chatbotEnabled} />
    </>
  );
}
