import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 p-4 text-center dark:bg-ink-950">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-danger-50 text-danger-500 dark:bg-danger-500/10">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Something broke</h1>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
              The error has been logged. Reloading usually fixes it.
            </p>
          </div>
          <Button size="sm" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
