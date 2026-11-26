import { forwardRef, useId } from 'react';
import { cn } from './cn';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, error, className, id, ...p }, ref) {
  const auto = useId();
  const iid = id ?? auto;
  return (
    <div className="w-full">
      {label && <label htmlFor={iid} className="mb-1.5 block text-sm font-medium text-text">{label}</label>}
      <input
        ref={ref}
        id={iid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${iid}-err` : undefined}
        className={cn(
          'w-full min-h-[44px] rounded-btn border bg-card px-4 text-base text-text placeholder:text-text3',
          'transition-shadow duration-base focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] focus-visible:border-gold',
          error ? 'border-red-500' : 'border-line',
          className,
        )}
        {...p}
      />
      {error && <p id={`${iid}-err`} className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});
