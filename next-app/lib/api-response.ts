import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Turns any caught error into a safe, user-friendly JSON response.
 *
 * - ZodError -> 400 with a short friendly summary plus a fieldErrors map
 *   (path -> message) built from the issues, so forms can highlight fields.
 * - Anything else -> the raw error is logged server-side only, and the
 *   client gets a generic message. Stack traces / exception text are
 *   never sent to the browser.
 *
 * The response shape (`{ ok, error }`) matches the convention already used
 * by every route in this app, so existing frontends that read `data.error`
 * keep working unchanged.
 */
export function apiError(e: unknown, fallbackStatus = 500) {
  if (e instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of e.issues) {
      const path = issue.path.join('.') || 'form';
      if (!(path in fieldErrors)) fieldErrors[path] = issue.message;
    }
    return NextResponse.json(
      {
        ok: false,
        error: e.issues[0]?.message || 'Please check the form and try again.',
        fieldErrors,
      },
      { status: 400 }
    );
  }

  // Mongo/Mongoose duplicate-key error (unique index collision) — without
  // this, any route relying on a unique index (Franchise.ownerEmail,
  // Coupon.code, etc.) fell through to the generic "Something went wrong"
  // message, hiding a perfectly explainable cause from whoever hit it.
  if (e && typeof e === 'object' && (e as any).code === 11000) {
    const field = Object.keys((e as any).keyValue || {})[0];
    return NextResponse.json(
      { ok: false, error: field ? `This ${field} is already in use.` : 'This value is already in use.' },
      { status: 409 }
    );
  }

  console.error(e);
  return NextResponse.json(
    { ok: false, error: 'Something went wrong. Please try again.' },
    { status: fallbackStatus }
  );
}
