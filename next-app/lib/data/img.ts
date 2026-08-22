// Builds a different real crop/framing of an already-verified Unsplash photo URL,
// so galleries and sliders show genuinely different views of a real, topic-accurate
// photo instead of gambling on unverified stock-photo IDs or unrelated placeholder images.
export function cropVariant(baseUrl: string, w: number, h: number, crop: string = 'entropy'): string {
  const base = baseUrl.split('?')[0];
  return `${base}?w=${w}&h=${h}&q=80&auto=format&fit=crop&crop=${crop}`;
}
