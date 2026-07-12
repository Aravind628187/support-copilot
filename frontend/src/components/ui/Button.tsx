import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent-600 text-white shadow-[0_14px_35px_-18px_rgba(54,84,209,0.85)] hover:bg-accent-700 active:bg-accent-800 disabled:bg-ink-200 disabled:text-ink-400',
  secondary:
    'bg-white/90 text-ink-950 border border-ink-200/80 shadow-sm hover:bg-ink-50 active:bg-ink-100 dark:bg-ink-800/90 dark:text-ink-100 dark:border-ink-800 dark:hover:bg-ink-800/70 disabled:opacity-50',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 active:bg-ink-200 dark:text-ink-400 dark:hover:bg-ink-800 disabled:opacity-50',
  danger:
    'bg-danger-500 text-white shadow-[0_14px_35px_-18px_rgba(220,38,38,0.85)] hover:bg-danger-600 active:bg-danger-600/90 disabled:bg-ink-200 disabled:text-ink-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
          'min-h-[44px] sm:min-h-0', // 44px tap target on touch, tighter on desktop pointer input
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
