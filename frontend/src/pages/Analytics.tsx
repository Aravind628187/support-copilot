import { BarChart3, Activity, ShieldCheck } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Seo title="Analytics" description="Operations analytics for support performance and SLA health." />

      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-accent-600 via-indigo-600 to-violet-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(54,84,209,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-100">Analytics</p>
            <h1 className="text-3xl font-semibold">Operational visibility</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Monitor tickets, team bandwidth, and service health with enterprise clarity.
            </p>
          </div>
          <Badge tone="accent">Updated 1m ago</Badge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">SLA health</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              View on-time response rates, overdue tickets, and SLA adherence.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">AI usage</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Track AI drafts, knowledge lookups, and assisted replies across your team.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">System health</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Surface uptime, API status, and infrastructure alerts in a single place.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
