import { cn } from './cn';

export function Card({ className, interactive, ...p }: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'bg-card border border-line rounded-card shadow-soft-1',
        interactive &&
          'transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-0.5 hover:shadow-soft-2 focus-within:shadow-soft-2',
        className,
      )}
      {...p}
    />
  );
}

export function Panel({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-card border border-line rounded-panel shadow-soft-2', className)} {...p} />;
}
