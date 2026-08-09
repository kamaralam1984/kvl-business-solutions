'use client';

declare global {
  interface Window { gtag?: (...args: any[]) => void; dataLayer?: any[]; fbq?: (...args: any[]) => void }
}

// Maps a trackEvent() name to a Google Ads conversion label (the
// "AW-XXXXXXX/LABEL" string from the Ads conversion action), read from env
// vars set per conversion type. Unset entries simply mean that event never
// fires an Ads conversion.
const AD_CONVERSION_LABELS: Record<string, string | undefined> = {
  lead_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LEAD,
  booking_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_BOOKING,
  proposal_request: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_PROPOSAL,
};

// Maps a trackEvent() name to a standard Meta Pixel event, fired via
// window.fbq (initialized in components/analytics/MetaPixel.tsx). Lets Meta
// actually see when an ad-driven visitor converts (not just PageView), so
// campaigns can be optimized for and reported on leads/purchases.
const META_PIXEL_EVENTS: Record<string, string | undefined> = {
  lead_submit: 'Lead',
  booking_submit: 'Lead',
  proposal_request: 'Lead',
  purchase: 'Purchase',
  // ViewContent/InitiateCheckout — without these, Meta only ever sees a
  // generic PageView plus the two terminal conversions, which starves
  // retargeting/lookalike audiences of "viewed this specific product" and
  // "started checkout" signals.
  view_content: 'ViewContent',
  begin_checkout: 'InitiateCheckout',
};

function hasConsent() {
  if (typeof document === 'undefined') return false;
  return document.cookie.match(/kvl_consent=([^;]+)/)?.[1] === 'accepted';
}

// The single entry point every widget/form/CTA in the app calls to record an
// interaction. It fans out to three places at once:
//   1. GA4/GTM (via the shared gtag() dataLayer, if the visitor has consented)
//   2. Google Ads conversion tracking, for the subset of events mapped above
//   3. This site's own database (/api/events), so the admin dashboard has
//      real CTR/lead-source/landing-page numbers with no external API needed
// `eventId` — when the caller has one (typically the just-created Lead/Order's
// _id, returned by the API response) — is passed through to fbq's eventID so
// Meta can dedupe this browser-side Pixel fire against the server-side
// Conversions API event sent for the same conversion (lib/metaCapi.ts). Both
// sides MUST use the identical id, or Meta double-counts the conversion.
export function trackEvent(name: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag && hasConsent()) {
    window.gtag('event', name, params);
    const label = AD_CONVERSION_LABELS[name];
    if (label) window.gtag('event', 'conversion', { send_to: label, ...params });
  }

  if (window.fbq && hasConsent()) {
    const fbEvent = META_PIXEL_EVENTS[name];
    if (fbEvent) window.fbq('track', fbEvent, params, eventId ? { eventID: eventId } : undefined);
  }

  if (hasConsent()) {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, params, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  }
}
