// Minimal User-Agent parser — real data derived directly from the request's
// own UA string, not a guess. Deliberately not a full device-detection
// library (no new dependency for Phase A); covers the common cases well
// enough for Module 1/2 reporting and falls back to 'unknown' rather than a
// wrong guess when a UA doesn't match any known pattern.
export function parseDevice(ua: string) {
  const type = /Mobi|Android(?!.*Tablet)|iPhone/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';

  let os = 'unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iOS/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

  return { type, os, browser };
}
