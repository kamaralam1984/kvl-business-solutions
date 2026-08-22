// A plain `fetch()` to a third-party API has no timeout of its own — if that
// provider hangs, the request a real customer is waiting on (chatbot reply,
// AI voice call) hangs with it, indefinitely. Wraps fetch with an
// AbortController so a slow/dead provider fails fast instead, matching the
// pattern already used for workflow webhooks (lib/workflows/runner.ts).
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e: any) {
    if (e.name === 'AbortError') throw new Error(`Request to ${new URL(url).hostname} timed out after ${timeoutMs}ms`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
