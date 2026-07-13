import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'group rounded-[20px] border border-white/80 bg-white/90 shadow-[0_20px_54px_-34px_rgba(15,23,42,0.2)] backdrop-blur transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-accent-200/80 hover:shadow-[0_24px_64px_-34px_rgba(54,84,209,0.24)] dark:border-white/10 dark:bg-[#0c101a]/90 dark:shadow-[0_24px_64px_-32px_rgba(0,0,0,0.48)] dark:hover:border-accent-500/35',
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
        'flex flex-wrap items-center justify-between gap-3 border-b border-ink-100/80 px-5 py-4 text-sm dark:border-ink-800/80',
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}
