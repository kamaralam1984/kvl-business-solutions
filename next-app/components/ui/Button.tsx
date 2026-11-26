import Link from 'next/link';
import { cn } from './cn';
import { rollChildren } from '@/components/studio/Roll';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 min-h-[44px] rounded-btn font-semibold ' +
  'transition-[transform,opacity,box-shadow] duration-base ease-brand ' +
  'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:opacity-50 disabled:pointer-events-none ' +
  'hover:-translate-y-px active:translate-y-0';
const variants: Record<Variant, string> = {
  primary: 'bg-gold text-[#080910] hover:shadow-soft-2',
  secondary: 'bg-card text-text border border-line hover:shadow-soft-1',
  ghost: 'text-text hover:bg-text/5',
};
const sizes: Record<Size, string> = { md: 'px-5 text-[15px]', lg: 'px-7 text-base' };

export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Props = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode } & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
);

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest;
    return <Link href={href} className={cls} {...a}>{rollChildren(children)}</Link>;
  }
  const b = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type="button" className={cls} {...b}>{rollChildren(children)}</button>;
}
