'use client';
import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes } from 'react';
import { trackEvent } from './track';

// Drop-in replacement for next/link on primary CTAs — fires a `cta_click`
// event (label + placement, for "which button/page converts") before
// navigating, then behaves exactly like Link otherwise.
export function TrackedLink({
  label,
  placement,
  onClick,
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { label: string; placement: string }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent('cta_click', { label, placement });
        onClick?.(e);
      }}
    />
  );
}
