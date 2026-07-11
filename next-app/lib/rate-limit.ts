type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (b.count >= max) return { allowed: false, remaining: 0, retryAfter: b.resetAt - now };
  b.count++;
  return { allowed: true, remaining: max - b.count };
}

export function clientIp(req: Request) {
  const h = req.headers;
  // x-forwarded-for is a comma-separated hop chain (client, proxy1, proxy2, ...).
  // The FIRST entry is whatever the original client claimed — fully attacker-controlled,
  // since a client can send any value it likes in that header. The LAST entry is the one
  // appended by the reverse proxy closest to this server (Vercel/nginx/etc.), which a
  // client cannot forge. Trusting the first entry lets any caller bypass IP-based rate
  // limiting by simply varying this header per request.
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map(ip => ip.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return h.get('x-real-ip') || 'unknown';
}
