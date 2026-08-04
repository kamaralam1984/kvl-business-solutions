// Module 2 (Geo Analytics). Production runs on a self-hosted Hostinger VPS
// via PM2 (`next start`), not behind Vercel's edge network, so the
// `x-vercel-ip-*` headers this was originally built against never exist
// there — geo capture silently produced zero data. This is the fix: a
// keyless, zero-recurring-cost IP lookup (ipapi.co's free tier, no account/
// API key needed) used only when the Vercel headers aren't present. Fails
// safe — on any error, timeout, or private/local IP, geo stays entirely
// absent rather than guessed.
export type GeoData = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
  source: string;
};

const cache = new Map<string, { data: GeoData | undefined; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // an IP's geo doesn't change intra-day

function isPrivateOrLocalIp(ip: string) {
  if (!ip || ip === 'unknown') return true;
  if (ip === '::1' || ip === '127.0.0.1') return true;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/.test(ip)) return true;
  return false;
}

export function readVercelGeo(headers: Headers): GeoData | undefined {
  const country = headers.get('x-vercel-ip-country') || undefined;
  const region = headers.get('x-vercel-ip-country-region') || undefined;
  const city = headers.get('x-vercel-ip-city') ? decodeURIComponent(headers.get('x-vercel-ip-city')!) : undefined;
  const timezone = headers.get('x-vercel-ip-timezone') || undefined;
  const latitude = headers.get('x-vercel-ip-latitude') || undefined;
  const longitude = headers.get('x-vercel-ip-longitude') || undefined;
  if (!country && !city) return undefined;
  return { country, region, city, timezone, latitude, longitude, source: 'vercel-edge' };
}

export async function lookupGeoByIp(ip: string): Promise<GeoData | undefined> {
  if (isPrivateOrLocalIp(ip)) return undefined;

  const cached = cache.get(ip);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  let result: GeoData | undefined;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const d = await res.json();
      if (!d.error && (d.country_code || d.city)) {
        result = {
          country: d.country_code || undefined,
          region: d.region || undefined,
          city: d.city || undefined,
          timezone: d.timezone || undefined,
          latitude: d.latitude != null ? String(d.latitude) : undefined,
          longitude: d.longitude != null ? String(d.longitude) : undefined,
          source: 'ipapi',
        };
      }
    }
  } catch {
    result = undefined; // timeout, network error, or rate-limited — fail safe, no guess
  }

  cache.set(ip, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

export async function resolveGeo(headers: Headers, ip: string): Promise<GeoData | undefined> {
  return readVercelGeo(headers) || lookupGeoByIp(ip);
}
