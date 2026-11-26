import { Children, type ReactNode } from 'react';

// Hover "text roll" label: the Studio design slides the text up while an identical copy slides in.
// Pure markup (no DOM mutation); unstyled in Classic.
export function Roll({ children }: { children: string }) {
  return (
    <span className="sx-roll">
      <span className="sx-roll-in" data-t={children.trim()}>{children}</span>
    </span>
  );
}

/** Wraps only the plain-text children of a button/link, leaving icons and other elements as they are. */
export function rollChildren(children: ReactNode): ReactNode {
  return Children.map(children, c => (typeof c === 'string' && c.trim() ? <Roll>{c}</Roll> : c));
}
