/* Hairline section dividers. Kept as named exports for existing imports; the
   old animated tri-colour lines are now a single static token-based rule. */
export function AnimatedDivider({ className = '' }: { color?: 'gold' | 'green' | 'blue'; className?: string }) {
  return <div className={`h-px w-full bg-line ${className}`} aria-hidden="true" />;
}

export function TriLineDivider({ className = '' }: { className?: string }) {
  return <AnimatedDivider className={className} />;
}
