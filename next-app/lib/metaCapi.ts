// Meta Conversions API — sends Lead/Purchase events server-side to Meta, in
// addition to the browser Pixel (components/analytics/MetaPixel.tsx +
// components/analytics/track.ts). Server-side delivery isn't blocked by ad
// blockers/ITP the way the browser Pixel is, and lets Meta hash-match
// customer email/phone directly, which is what actually drives Event Match
// Quality (EMQ) and ad attribution accuracy.
// Set META_CAPI_ACCESS_TOKEN in .env.local to enable (see .env.example).
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';
const GRAPH_VERSION = 'v21.0';

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Meta requires PII fields lowercased/trimmed then SHA-256 hashed before they
// ever leave this server — see https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
function hashEmail(email?: string) {
  if (!email) return undefined;
  return sha256(email.trim().toLowerCase());
}

function hashPhone(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  // Meta wants E.164 digits with country code, no leading "+". This site's
  // phone fields are Indian numbers entered as plain 10-digit mobiles.
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return sha256(normalized);
}

interface CapiUserData {
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

interface CapiEventInput {
  eventName: 'Lead' | 'Purchase';
  eventId: string;
  eventSourceUrl?: string;
  user: CapiUserData;
  customData?: Record<string, unknown>;
}

async function sendCapiEvent(input: CapiEventInput) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log(`[metaCapi] Not configured — would send ${input.eventName} event ${input.eventId}`);
    return;
  }

  const user_data: Record<string, unknown> = {};
  const em = hashEmail(input.user.email);
  const ph = hashPhone(input.user.phone);
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];
  if (input.user.clientIp) user_data.client_ip_address = input.user.clientIp;
  if (input.user.userAgent) user_data.client_user_agent = input.user.userAgent;
  if (input.user.fbp) user_data.fbp = input.user.fbp;
  if (input.user.fbc) user_data.fbc = input.user.fbc;

  const body = {
    data: [{
      event_name: input.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      action_source: 'website',
      event_source_url: input.eventSourceUrl,
      user_data,
      ...(input.customData ? { custom_data: input.customData } : {}),
    }],
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const data = await res.json().catch(() => null);
  // Meta returns 200 with an `error` field in the body for some validation
  // failures (bad hash format, disabled dataset, etc.) — checking res.ok
  // alone would let those fail silently, same trap as lib/whatsapp.ts.
  if (!res.ok || data?.error) {
    throw new Error(`Meta CAPI error ${res.status}: ${data?.error?.message || 'unknown response'}`);
  }
}

// event_id must be the SAME value passed to the browser Pixel's fbq('track',
// ..., { eventID }) call for the same conversion, so Meta collapses the two
// into one event instead of double-counting. Callers pass the just-created
// document's _id for this, since the client already receives it in the POST
// response before firing its own trackEvent() call.
export async function sendLeadCapiEvent(params: {
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
}) {
  return sendCapiEvent({
    eventName: 'Lead',
    eventId: params.eventId,
    eventSourceUrl: params.eventSourceUrl,
    user: {
      email: params.email, phone: params.phone,
      clientIp: params.clientIp, userAgent: params.userAgent,
      fbp: params.fbp, fbc: params.fbc,
    },
  });
}

export async function sendPurchaseCapiEvent(params: {
  eventId: string;
  email?: string;
  phone?: string;
  value: number;
  currency?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
}) {
  return sendCapiEvent({
    eventName: 'Purchase',
    eventId: params.eventId,
    eventSourceUrl: params.eventSourceUrl,
    user: {
      email: params.email, phone: params.phone,
      clientIp: params.clientIp, userAgent: params.userAgent,
      fbp: params.fbp, fbc: params.fbc,
    },
    customData: { value: params.value, currency: params.currency || 'INR' },
  });
}

// Reads the request's IP/UA/_fbp/_fbc so route handlers don't each duplicate
// this boilerplate.
export function capiRequestContext(req: Request, clientIp: string) {
  const cookieHeader = req.headers.get('cookie') || '';
  const fbp = cookieHeader.match(/_fbp=([^;]+)/)?.[1];
  const fbc = cookieHeader.match(/_fbc=([^;]+)/)?.[1];
  return {
    clientIp,
    userAgent: req.headers.get('user-agent') || undefined,
    eventSourceUrl: req.headers.get('referer') || process.env.NEXT_PUBLIC_SITE_URL,
    fbp,
    fbc,
  };
}
