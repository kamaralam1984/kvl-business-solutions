import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { cn } from './cn';
import { Card } from './Card';

// One look for empty / loading / error states across public pages.
export function StateMessage({
  kind = 'empty', title, description, action, className,
}: {
  kind?: 'empty' | 'loading' | 'error'; title: string; description?: React.ReactNode; action?: React.ReactNode; className?: string;
}) {
  const Icon = kind === 'error' ? AlertTriangle : kind === 'loading' ? Loader2 : Inbox;
  return (
    <Card
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
      className={cn('mx-auto w-full max-w-md p-8 [overflow-wrap:anywhere] text-center', className)}
    >
      <span className={cn('mx-auto mb-4 grid h-12 w-12 place-items-center rounded-btn', kind === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-gold/15 text-gold-text')}>
        <Icon className={cn('h-6 w-6', kind === 'loading' && 'animate-spin motion-reduce:animate-none')} aria-hidden />
      </span>
      <h2 className="font-display text-card-title text-text">{title}</h2>
      {description && <p className="mt-2 text-text2">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </Card>
  );
}
