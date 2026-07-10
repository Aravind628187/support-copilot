import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as authApi from '../../api/auth';
import { signupSchema, SignupFormValues } from '../../lib/validation';
import { extractErrorMessage } from '../../api/client';

export function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await authApi.signup(values);
      setDone(true);
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Could not create your account'));
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
        <div className="w-full max-w-sm rounded-lg border border-ink-200 bg-white p-6 text-center shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-success-500" />
          <h1 className="mb-1 text-lg font-semibold">Check the server log</h1>
          <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
            This demo has no real mail provider wired up, so your verification link was written to
            the backend console instead of your inbox. Copy the token from there into the link
            below.
          </p>
          <Button className="w-full" onClick={() => navigate('/login')}>
            Go to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-accent-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">SupportCopilot</span>
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="mb-1 text-lg font-semibold">Create your account</h1>
          <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
            The first account created becomes an admin automatically.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input id="name" label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
            <Input
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              hint="At least 10 characters, with an uppercase letter, lowercase letter, and a number."
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p role="alert" className="text-sm text-danger-500">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-600 hover:underline dark:text-accent-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
