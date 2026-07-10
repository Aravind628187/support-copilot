import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'ai';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500',
  ai: 'bg-ai-50 text-ai-600 dark:bg-ai-500/10 dark:text-ai-400',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
