import { useEffect, useState } from 'react';
import { Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({ email: true, inApp: true });

  useEffect(() => {
    const stored = window.localStorage.getItem('support-copilot:notification-preferences');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Partial<typeof preferences>;
      setPreferences((current) => ({ ...current, ...parsed }));
    } catch {
      window.localStorage.removeItem('support-copilot:notification-preferences');
    }
  }, []);

  function togglePreference(key: keyof typeof preferences) {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      window.localStorage.setItem('support-copilot:notification-preferences', JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Notifications" description="Configure alerts and notifications for support workflows." />

      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-accent-600 via-indigo-600 to-violet-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(54,84,209,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-100">Notifications</p>
            <h1 className="text-3xl font-semibold">Alerting and updates</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Manage how your team receives ticket alerts, SLA escalations, and customer updates.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/settings')}>Notification rules</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Email alerts</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Keep stakeholders informed with email triggers for urgent tickets and SLA risks.
            </p>
            <PreferenceToggle
              checked={preferences.email}
              onChange={() => togglePreference('email')}
              label="Email alerts"
              description="Urgent ticket and SLA escalation emails"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">In-app alerts</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Enable real-time activity notifications for agents and managers.
            </p>
            <PreferenceToggle
              checked={preferences.inApp}
              onChange={() => togglePreference('inApp')}
              label="In-app alerts"
              description="Ticket assignments and queue activity"
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function PreferenceToggle({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-ink-50/70 p-3.5 dark:border-ink-800 dark:bg-ink-950/40">
      <span>
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
          {checked && <CheckCircle2 className="h-4 w-4 text-success-500" />}
          {label}
        </span>
        <span className="mt-1 block text-xs text-ink-500 dark:text-ink-400">{description}</span>
      </span>
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-ink-300 text-accent-600 focus:ring-accent-500 dark:border-ink-700"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}
