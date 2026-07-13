import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Seo } from '../../components/Seo';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormValues } from '../../lib/validation';
import { extractErrorMessage } from '../../api/client';
import { googleLoginUrl } from '../../api/auth';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [navigate, user]);

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setServerError(
        extractErrorMessage(err, 'Could not log in — please try again')
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
      <Seo
        title="Log in"
        description="Log in to SupportCopilot to manage tickets and collaborate with your team."
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <span className="text-xl font-semibold text-ink-950 dark:text-white">
            SupportCopilot
          </span>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="mb-1 text-2xl font-semibold text-ink-950 dark:text-white">
            Log in
          </h1>

          <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
            Welcome back — pick up where you left off.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
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
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p
                role="alert"
                className="text-sm text-danger-500"
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
            >
              Log in
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <span>or</span>
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>

          <Button type="button" variant="secondary" className="w-full" onClick={() => window.location.assign(googleLoginUrl())}>
            Continue with Google
          </Button>

          {searchParams.get('oauth') === 'error' && (
            <p role="alert" className="mt-3 text-sm text-danger-500">
              Google sign-in was cancelled or could not be completed.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-accent-600 hover:underline dark:text-accent-400"
            >
              Forgot password?
            </Link>

            <Link
              to="/signup"
              className="text-accent-600 hover:underline dark:text-accent-400"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
