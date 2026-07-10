import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import * as authApi from '../../api/auth';
import { extractErrorMessage } from '../../api/client';

type Status = 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
  const [message, setMessage] = useState('This link is missing a verification token.');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    authApi
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus('success');
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus('error');
          setMessage(extractErrorMessage(err, 'This verification link is invalid or has expired'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-lg border border-ink-200 bg-white p-6 text-center shadow-sm dark:border-ink-800 dark:bg-ink-900">
        {status === 'verifying' && (
          <>
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-ink-400" />
            <p className="text-sm text-ink-600 dark:text-ink-400">Verifying your email…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-success-500" />
            <h1 className="mb-1 text-lg font-semibold">Email verified</h1>
            <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
              You can now create and reply to tickets.
            </p>
            <Link to="/login">
              <Button className="w-full">Go to login</Button>
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-3 h-8 w-8 text-danger-500" />
            <h1 className="mb-1 text-lg font-semibold">Verification failed</h1>
            <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">{message}</p>
            <Link to="/login" className="text-sm text-accent-600 hover:underline dark:text-accent-400">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
