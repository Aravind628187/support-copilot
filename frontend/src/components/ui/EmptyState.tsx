import { ReactNode } from 'react';
import { AlertTriangle, Inbox, SearchX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-ink-200/70 bg-white/95 p-8 text-center shadow-lg shadow-ink-200/50 dark:border-ink-800 dark:bg-ink-950/80 dark:shadow-black/10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300">
        {icon ?? <Inbox className="h-7 w-7" aria-hidden="true" />}
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-xl font-semibold text-ink-950 dark:text-ink-100">{title}</p>
        {description && <p className="mx-auto max-w-md text-sm text-ink-600 dark:text-ink-400">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      icon={<SearchX className="h-7 w-7" aria-hidden="true" />}
      title="No results found"
      description="Adjust your filters or search terms to find relevant items across the workspace."
      actionLabel="Clear filters"
      onAction={onReset}
    />
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[28px] border border-danger-100/80 bg-danger-50/70 p-8 text-center shadow-lg shadow-danger-100/30 dark:border-danger-500/20 dark:bg-danger-500/10 dark:text-white">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-danger-500/10 text-danger-600 dark:bg-danger-500/20 dark:text-danger-200">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-xl font-semibold text-ink-950 dark:text-white">Something went wrong</p>
        <p className="mx-auto max-w-md text-sm text-ink-600 dark:text-ink-300">
          {message ?? 'We could not load this section. Please try again or contact support.'}
        </p>
      </div>
      {onRetry && (
        <div className="mt-6">
          <Button size="sm" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
