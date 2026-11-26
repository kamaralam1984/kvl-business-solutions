import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

// Renders every word of a heading as a clipped "mask" span so the Studio design can slide the
// words up one by one. This is plain markup produced by React itself (server and client agree),
// so nothing mutates the DOM after hydration. In Classic the spans have no styling.
export function SplitText({ children }: { children: ReactNode }) {
  const counter = { i: 0 };
  return <>{walk(children, counter)}</>;
}

function walk(node: ReactNode, counter: { i: number }): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    const parts = String(node).split(/(\s+)/);
    return parts.map((part, k) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return ' ';
      const i = counter.i++;
      return (
        <span key={k} className="sx-w">
          <span className="sx-wi" style={{ '--i': i } as React.CSSProperties}>{part}</span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) return Children.map(node, c => walk(c, counter));
  if (isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: ReactNode }>;
    if (el.type === 'br' || el.props.children === undefined) return node;
    return cloneElement(el, undefined, walk(el.props.children, counter));
  }
  return node;
}
