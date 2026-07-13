import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react';
import { cn } from '../../lib/utils';

interface FieldWrapperProps {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  children?: React.ReactNode;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
}

function FieldChrome({
  label,
  error,
  hint,
  id,
  children,
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-ink-800 dark:text-ink-100"
        >
          {label}
        </label>
      )}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-danger-500"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="text-xs text-ink-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, leadingIcon, ...props }, ref) => (
    <FieldChrome
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <div className="relative">
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-400">
            {leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${id}-error`
              : hint
              ? `${id}-hint`
              : undefined
          }
          className={cn(
            'h-10 w-full rounded-xl border border-ink-200/80 bg-white/90 px-3 text-sm text-ink-950 placeholder:text-ink-400',
            leadingIcon ? 'pl-10' : 'pl-3',
            'transition-all duration-150',
            'focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20',
            'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
            'dark:border-ink-800 dark:bg-ink-900/90 dark:text-ink-100',
            error && 'border-danger-500 focus:ring-danger-500',
            className,
          )}
          {...props}
        />
      </div>
    </FieldChrome>
  )
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...props }, ref) => (
    <FieldChrome
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${id}-error`
            : hint
            ? `${id}-hint`
            : undefined
        }
        className={cn(
          'min-h-[96px] w-full rounded-xl border border-ink-200/80 bg-white/90 px-3 py-2 text-sm text-ink-950 placeholder:text-ink-400 resize-y',
          'transition-all duration-150',
          'focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20',
          'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
          'dark:border-ink-800 dark:bg-ink-900/90 dark:text-ink-100',
          error && 'border-danger-500 focus:ring-danger-500',
          className
        )}
        {...props}
      />
    </FieldChrome>
  )
);

Textarea.displayName = 'Textarea';