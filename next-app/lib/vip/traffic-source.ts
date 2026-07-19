// Module 3 (Traffic Analytics) — classifies a session's first-touch channel
// from real signals only (UTM params, referrer hostname). Never guesses: if
// none of the rules below match, the channel is 'direct' (no referrer, no
// UTM) or 'referral' (a referrer exists but doesn't match a known pattern) —
// both are honest descriptions of what was actually observed, not filler.
export function classifyChannel(input: { utm?: { source?: string; medium?: string } | null; referrer?: string | null }): string {
  const { utm, referrer } = input;

  if (utm?.source) {
    const s = utm.source.toLowerCase();
    const m = (utm.medium || '').toLowerCase();
    if (s.includes('google') && m.includes('cpc')) return 'google-ads';
    if (s.includes('facebook') || s === 'fb') return m.includes('cpc') || m.includes('paid') ? 'facebook-ads' : 'facebook-organic';
    if (s.includes('instagram') || s === 'ig') return 'instagram';
    if (s.includes('linkedin')) return 'linkedin';
    if (s.includes('whatsapp')) return 'whatsapp';
    if (m.includes('email')) return 'email';
    return `campaign:${s}`;
  }

  if (!referrer) return 'direct';

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (host.includes('google.')) return 'google-organic';
    if (host.includes('bing.')) return 'bing-organic';
    if (host.includes('facebook.') || host.includes('fb.com')) return 'facebook-organic';
    if (host.includes('instagram.')) return 'instagram';
    if (host.includes('linkedin.')) return 'linkedin';
    if (host.includes('wa.me') || host.includes('whatsapp.')) return 'whatsapp';
    if (host === 'kvlbusinesssolutions.com') return 'internal';
    return `referral:${host}`;
  } catch {
    return 'referral';
  }
}
