import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, X, XCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  showToast: (input: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 4000;

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-success-500/30 text-success-600' },
  error: { icon: XCircle, classes: 'border-danger-500/30 text-danger-600' },
  info: { icon: Info, classes: 'border-accent-500/30 text-accent-600' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback<ToastContextValue['showToast']>(
    (input) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...input, id }]);
      // Errors stay until manually dismissed; success/info auto-dismiss.
      if (input.variant !== 'error') {
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const { icon: Icon, classes } = variantStyles[toast.variant];
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-2 rounded-lg border bg-white p-3 shadow-lg dark:bg-ink-900',
                'toast-enter',
                classes,
              )}
              role="status"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm text-ink-950 dark:text-ink-100">{toast.message}</p>
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={toast.onAction}
                  className="text-sm font-medium underline underline-offset-2"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
