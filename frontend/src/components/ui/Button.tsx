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
    'bg-gradient-to-r from-accent-600 to-violet-700 text-white shadow-[0_16px_50px_-28px_rgba(54,84,209,0.55)] hover:shadow-[0_18px_60px_-30px_rgba(54,84,209,0.55)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'bg-white/95 text-ink-950 border border-ink-200/80 shadow-sm hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100 dark:bg-ink-900/95 dark:text-ink-100 dark:border-ink-800 dark:hover:bg-ink-800/70 disabled:opacity-50',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 active:bg-ink-200 dark:text-ink-300 dark:hover:bg-ink-800 disabled:opacity-50',
  danger:
    'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-[0_16px_50px_-28px_rgba(220,38,38,0.4)] hover:shadow-[0_18px_60px_-30px_rgba(220,38,38,0.4)] active:scale-[0.99] disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm gap-2',
  md: 'h-12 px-5 text-sm gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/30',
          'min-h-[44px] sm:min-h-0',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
