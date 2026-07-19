const ENDPOINT = 'https://api.indexnow.org/indexnow';

// Actively pushes changed URLs to IndexNow (Bing/Yandex/Seznam etc. pick these
// up within minutes instead of waiting for the next crawl). Requires
// INDEXNOW_KEY to be set — the key file itself is already served at
// /{key}.txt via app/api/indexnow/[key]/route.ts + the next.config.js rewrite.
// No-ops silently if the key isn't configured, and never throws — a failed
// indexing ping must never block a content publish/update flow.
export async function submitToIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || paths.length === 0) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
  const host = new URL(site).host;

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${site}/${key}.txt`,
        urlList: paths.map((p) => `${site}${p}`),
      }),
    });
  } catch {
    // best-effort — indexing pings must not fail the publish flow
  }
}
