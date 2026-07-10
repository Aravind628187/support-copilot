import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as authApi from '../../api/auth';
import { resetPasswordSchema, ResetPasswordFormValues } from '../../lib/validation';
import { extractErrorMessage } from '../../api/client';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    try {
      await authApi.resetPassword(token, values.password);
      navigate('/login');
    } catch (err) {
      setServerError(extractErrorMessage(err, 'This reset link is invalid or has expired'));
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
        <div className="w-full max-w-sm rounded-lg border border-ink-200 bg-white p-6 text-center shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <p className="mb-4 text-sm text-ink-600 dark:text-ink-400">
            This link is missing a reset token. Request a new one from the forgot-password page.
          </p>
          <Link to="/forgot-password" className="text-sm text-accent-600 hover:underline dark:text-accent-400">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-lg border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <h1 className="mb-1 text-lg font-semibold">Set a new password</h1>
        <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
          This will sign you out everywhere else.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="password"
            type="password"
            label="New password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {serverError && (
            <p role="alert" className="text-sm text-danger-500">
              {serverError}
            </p>
          )}
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
