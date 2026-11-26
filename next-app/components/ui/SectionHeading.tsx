import { cn } from './cn';
import { SplitText } from '@/components/studio/SplitText';

export function SectionHeading({
  eyebrow, title, description, align = 'left', as: Tag = 'h2', className,
}: {
  eyebrow?: string; title: React.ReactNode; description?: React.ReactNode;
  align?: 'left' | 'center'; as?: 'h1' | 'h2' | 'h3'; className?: string;
}) {
  return (
    <div className={cn('sx-sh max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className="sx-split font-display text-section text-text"><SplitText>{title}</SplitText></Tag>
      {description && <p className="mt-4 text-body-lg text-text2">{description}</p>}
    </div>
  );
}
