import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded bg-ink-100 dark:bg-ink-800', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function TicketRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-ink-100 px-4 py-3 dark:border-ink-800">
      <Skeleton className="h-4 w-4 rounded-sm" />
      <Skeleton className="h-4 w-24 rounded-pill" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-20 rounded-pill" />
      <Skeleton className="h-4 w-16 rounded-pill" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-lg border border-ink-200 p-4 dark:border-ink-800">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
