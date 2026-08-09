'use client';
import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared modal shell — every backdrop+card popup/dialog in the app (exit-intent
// popup, quote modal, admin edit dialogs) was previously mouse-only: no
// role="dialog", no Escape handling, no focus trap/restore. This is a drop-in
// replacement for that raw `<div className="fixed inset-0 ..." onClick={close}>
// <div onClick={e=>e.stopPropagation()}>...</div></div>` pattern — pass the
// existing classNames through so visuals don't change, only keyboard/AT
// behavior does.
export function Modal({
  onClose,
  children,
  className = 'card-base p-6 max-w-md w-full',
  containerClassName = 'fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur',
  style,
  containerStyle,
  labelledBy,
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  labelledBy?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const card = cardRef.current;
    const focusable = card?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusable?.[0] || card)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !card) return;
      const items = card.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  return (
    <div className={containerClassName} style={containerStyle} onClick={onClose}>
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={className}
        style={style}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
