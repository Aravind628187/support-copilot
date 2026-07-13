import { Bell, BellRing } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const navigate = useNavigate();
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
