import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[16px] border border-white/80 bg-white/90 shadow-[0_24px_64px_-32px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-ink-950/80 dark:shadow-[0_24px_64px_-32px_rgba(0,0,0,0.32)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-ink-100/80 px-4 py-3 text-sm dark:border-ink-800/80',
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />;
}
