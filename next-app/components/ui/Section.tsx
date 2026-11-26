import { cn } from './cn';

// Standard page section: 68px (mobile) / 100px (desktop) vertical rhythm.
// tone="alt" gives the quiet alternate background used to separate sections.
export function Section({
  tone = 'base', className, containerClassName, children, ...p
}: React.HTMLAttributes<HTMLElement> & { tone?: 'base' | 'alt'; containerClassName?: string }) {
  return (
    <section className={cn('py-[var(--section-y)]', tone === 'alt' ? 'bg-bg2' : 'bg-bg', className)} {...p}>
      <div className={cn('container', containerClassName)}>{children}</div>
    </section>
  );
}
