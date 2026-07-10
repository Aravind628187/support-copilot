import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 p-4 text-center dark:bg-ink-950">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-ink-100 text-ink-400 dark:bg-ink-800">
        <Compass className="h-7 w-7" />
      </div>
      <div>
        <p className="font-mono text-sm text-ink-400">404</p>
        <h1 className="text-lg font-semibold">This page doesn&apos;t exist</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          The link might be broken, or the page may have moved.
        </p>
      </div>
      <Link to="/">
        <Button size="sm">Back to dashboard</Button>
      </Link>
    </div>
  );
}
