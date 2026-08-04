'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// KVL Visitor Intelligence Platform — client capture SDK (Phase A).
// Deliberately a separate pipeline from components/analytics/track.ts (GA4/
// Ads/Meta/etc): that module feeds third-party marketing platforms; this one
// feeds KVL's own internal sales-intelligence DB. See PHASE22-VIP-ARCHITECTURE.md.
//
// Phase A scope only: no raw mousemove/hover capture (that's heatmaps/replay,
// Phase B), no field-value capture ever (forms only report that an
// interaction happened, never what was typed — masking by construction, not
// by a redaction step that could fail).

const VID_COOKIE = 'vip_vid';
const SID_COOKIE = 'vip_sid';
const VID_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years
const SID_MAX_AGE = 60 * 30; // 30 min sliding
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_BATCH_SIZE = 20;
const RAGE_CLICK_WINDOW_MS = 1000;
const RAGE_CLICK_THRESHOLD = 3;

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}
function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function hasConsent() {
  return document.cookie.match(/kvl_consent=([^;]+)/)?.[1] === 'accepted';
}

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [role="button"], [onclick]';

export function VipTracker() {
  const pathname = usePathname();
  const queueRef = useRef<any[]>([]);
  const vidRef = useRef<string>('');
  const sidRef = useRef<string>('');
  const isNewSessionRef = useRef(false);
  const pageEnteredAtRef = useRef<number>(Date.now());
  const maxScrollPctRef = useRef(0);
  const recentClicksRef = useRef<{ ts: number; target: EventTarget | null }[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const push = (type: string, payload?: Record<string, any>) => {
    queueRef.current.push({ type, path: pathname, ts: Date.now(), payload });
    if (queueRef.current.length >= FLUSH_BATCH_SIZE) flush();
  };

  const flush = (useBeacon = false) => {
    if (!hasConsent() || queueRef.current.length === 0) return;
    const events = queueRef.current.splice(0, queueRef.current.length);
    const body = JSON.stringify({
      vid: vidRef.current,
      sessionId: sidRef.current,
      isNewSession: isNewSessionRef.current,
      referrer: document.referrer || undefined,
      utm: isNewSessionRef.current ? readUtmFromUrl() : undefined,
      events,
    });
    isNewSessionRef.current = false;

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/vip/events', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/vip/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  };

  // Identity + session bootstrap — runs once.
  useEffect(() => {
    if (!hasConsent()) return;
    let vid = getCookie(VID_COOKIE);
    if (!vid) { vid = newId(); setCookie(VID_COOKIE, vid, VID_MAX_AGE); }
    vidRef.current = vid;

    let sid = getCookie(SID_COOKIE);
    if (!sid) {
      sid = newId();
      isNewSessionRef.current = true;
    }
    setCookie(SID_COOKIE, sid, SID_MAX_AGE); // (re)set — sliding expiry either way
    sidRef.current = sid;

    flushTimerRef.current = setInterval(() => flush(), FLUSH_INTERVAL_MS);
    const onHide = () => flush(true);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') onHide(); });
    window.addEventListener('pagehide', onHide);

    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
      window.removeEventListener('pagehide', onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Per-pageview: reset scroll tracking, emit page_view.
  useEffect(() => {
    if (!hasConsent()) return;
    pageEnteredAtRef.current = Date.now();
    maxScrollPctRef.current = 0;
    push('page_view');
    return () => {
      // Fires on path change (SPA nav) — report the page we're leaving.
      const seconds = Math.round((Date.now() - pageEnteredAtRef.current) / 1000);
      push('page_view', { exiting: true, timeOnPageSeconds: seconds, scrollDepthPct: maxScrollPctRef.current });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Behavioural event listeners — attached once.
  useEffect(() => {
    if (!hasConsent()) return;

    const scrollMilestonesFired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      maxScrollPctRef.current = Math.max(maxScrollPctRef.current, pct);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !scrollMilestonesFired.has(m)) {
          scrollMilestonesFired.add(m);
          push('scroll_milestone', { pct: m });
        }
      }
    };

    const classifyLink = (el: HTMLElement): string | null => {
      const href = (el.closest('a') as HTMLAnchorElement | null)?.href || '';
      if (href.startsWith('https://wa.me') || href.includes('api.whatsapp.com')) return 'whatsapp_click';
      if (href.startsWith('tel:')) return 'call_click';
      if (el.closest('a')?.hasAttribute('download')) return 'download';
      return null;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const now = Date.now();

      // Rage click — 3+ clicks on the same target within 1s. Real, tracked
      // signal, not estimated.
      recentClicksRef.current = recentClicksRef.current.filter(c => now - c.ts < RAGE_CLICK_WINDOW_MS);
      recentClicksRef.current.push({ ts: now, target });
      const sameTargetCount = recentClicksRef.current.filter(c => c.target === target).length;
      const isRage = sameTargetCount >= RAGE_CLICK_THRESHOLD;

      // Dead click — click landed on a non-interactive element. Heuristic by
      // construction (no reliable way to confirm "nothing happened" from a
      // single event handler), explicitly labeled as such in the payload.
      const isInteractive = !!target.closest(INTERACTIVE_SELECTOR);

      const xPct = Math.round((e.clientX / window.innerWidth) * 1000) / 10;
      const yPct = Math.round((e.clientY / window.innerHeight) * 1000) / 10;
      const label = (target.textContent || '').trim().slice(0, 60);
      const meta = { xPct, yPct, tag: target.tagName.toLowerCase(), label };

      const linkType = classifyLink(target);
      if (isRage) push('rage_click', meta);
      else if (linkType) push(linkType, meta);
      else if (isInteractive) push('click', meta);
      else push('dead_click', { ...meta, heuristic: true });
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const form = target?.closest('form');
      if (form && !form.dataset.vipStartTracked) {
        form.dataset.vipStartTracked = '1';
        push('form_start', { formId: form.id || form.getAttribute('name') || undefined });
      }
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      push('form_submit', { formId: form?.id || form?.getAttribute('name') || undefined });
    };
    const onCopy = () => push('copy');
    const onPaste = () => push('paste');
    const onError = (e: ErrorEvent) => push('js_error', { message: e.message?.slice(0, 200) });

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, true);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    window.addEventListener('error', onError);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('submit', onSubmit, true);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      window.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function readUtmFromUrl() {
  const sp = new URLSearchParams(window.location.search);
  const utm = {
    source: sp.get('utm_source') || undefined,
    medium: sp.get('utm_medium') || undefined,
    campaign: sp.get('utm_campaign') || undefined,
    term: sp.get('utm_term') || undefined,
    content: sp.get('utm_content') || undefined,
  };
  return Object.values(utm).some(Boolean) ? utm : undefined;
}
