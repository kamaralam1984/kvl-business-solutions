'use client';
// Brand-styled wrapper over the existing accessible shell (Escape, focus trap, focus restore).
import { Modal as Shell } from '@/components/shared/Modal';
import { cn } from './cn';

export function Modal({ onClose, labelledBy, className, children }: {
  onClose: () => void; labelledBy?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <Shell
      onClose={onClose}
      labelledBy={labelledBy}
      containerClassName="fixed inset-0 z-50 grid place-items-center p-4 bg-black/55 backdrop-blur-sm"
      className={cn('w-full max-w-md bg-card border border-line rounded-panel shadow-soft-3 p-6 focus:outline-none', className)}
    >
      {children}
    </Shell>
  );
}
