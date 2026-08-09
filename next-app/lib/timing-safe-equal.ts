import crypto from 'crypto';

// crypto.timingSafeEqual throws on length mismatch and requires equal-length
// buffers, so a plain-length check up front is fine (it doesn't leak byte
// content, just length — an attacker already knows the expected value's
// length for a fixed-format secret/digest). Used anywhere a server-known
// secret gets compared against an attacker-influenced value: webhook
// signatures, shared-secret headers, etc.
export function timingSafeEqual(expected: string, actual: unknown): boolean {
  if (typeof actual !== 'string' || actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}
