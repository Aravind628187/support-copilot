import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as authApi from '../../api/auth';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../../lib/validation';
import { extractErrorMessage } from '../../api/client';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    try {
      await authApi.forgotPassword(values.email);
      setSent(true);
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-lg border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-3 h-8 w-8 text-success-500" />
            <h1 className="mb-1 text-lg font-semibold">Check the server log</h1>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              If that email is registered, a reset link was written to the backend console (no real
              mail provider is configured in this demo).
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-lg font-semibold">Reset your password</h1>
            <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
              We will send a link that&apos;s valid for 30 minutes.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <Input
                id="email"
                type="email"
                label="Email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              {serverError && (
                <p role="alert" className="text-sm text-danger-500">
                  {serverError}
                </p>
              )}
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Send reset link
              </Button>
            </form>
          </>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-accent-600 hover:underline dark:text-accent-400">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
