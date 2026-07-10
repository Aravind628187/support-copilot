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
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink-100 text-ink-400 dark:bg-ink-800">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-ink-950 dark:text-ink-100">{title}</p>
        {description && <p className="max-w-sm text-sm text-ink-600 dark:text-ink-400">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/** Used specifically for "no results for this filter" — distinct from a true empty state. */
export function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
      title="No matches for these filters"
      description="Try a different search term or clear your filters to see everything."
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
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-danger-50 text-danger-500 dark:bg-danger-500/10">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-ink-950 dark:text-ink-100">Something went wrong</p>
        <p className="max-w-sm text-sm text-ink-600 dark:text-ink-400">
          {message ?? 'We could not load this. The issue has been logged.'}
        </p>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
