import { useMemo } from 'react';
import { Bell, MoonStar, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Seo } from '../components/Seo';
import { initials } from '../lib/utils';

export function ProfilePage() {
  const { user } = useAuth();

  const roleLabel = useMemo(() => (user?.role === 'ADMIN' ? 'Administrator' : 'Agent'), [user?.role]);

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Profile" description="Manage your account preferences and profile information." />

      <div className="rounded-3xl border border-ink-200/70 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(2,6,23,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold backdrop-blur">
              {user ? initials(user.name) : 'U'}
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">Account profile</p>
              <h1 className="text-2xl font-semibold">{user?.name ?? 'Your profile'}</h1>
              <p className="mt-1 text-sm text-white/80">{user?.email ?? 'Signed in securely'}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <p className="text-white/70">Current role</p>
            <p className="mt-1 font-semibold">{roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold">Account overview</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">A concise snapshot of your workspace access.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4 dark:border-ink-800 dark:bg-ink-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Verified and protected</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Your session is secured with role-aware access controls.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-ink-400">Email status</p>
                <p className="mt-2 text-sm font-semibold">{user?.isEmailVerified ? 'Verified' : 'Pending verification'}</p>
              </div>
              <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-ink-400">Workspace</p>
                <p className="mt-2 text-sm font-semibold">Support Copilot</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold">Preferences</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">Fine-tune how your experience feels.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                  <MoonStar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Theme</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Dark mode is available instantly from the header.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Adjust</Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Keep your queue moving with timely updates.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </div>

            <div className="rounded-2xl border border-dashed border-accent-200 bg-accent-50/70 p-4 text-sm text-accent-700 dark:border-accent-800 dark:bg-accent-500/10 dark:text-accent-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>More advanced profile controls can be layered in as the product evolves.</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">What’s next</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">This profile experience is ready to grow with deeper settings.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
              <p className="text-sm font-semibold">Theme preferences</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Light, dark, and system-aware options.</p>
            </div>
            <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
              <p className="text-sm font-semibold">Notification controls</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Stay informed without the noise.</p>
            </div>
            <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
              <p className="text-sm font-semibold">Security center</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage your access posture as the team grows.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
