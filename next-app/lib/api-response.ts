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

  console.error(e);
  return NextResponse.json(
    { ok: false, error: 'Something went wrong. Please try again.' },
    { status: fallbackStatus }
  );
}
