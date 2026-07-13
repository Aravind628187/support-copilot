import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Activity, ShieldCheck, Clock3, UsersRound, TicketCheck } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ErrorState } from '../components/ui/EmptyState';
import { fetchDashboardSummary } from '../api/users';
import { formatCompactNumber, formatHours } from '../lib/utils';

export function AnalyticsPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  const metrics = useMemo(() => {
    const total = data?.ticketsByStatus.reduce((sum, item) => sum + item.count, 0) ?? 0;
    const resolved = data?.ticketsByStatus.find((item) => item.status === 'RESOLVED')?.count ?? 0;
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
    return { total, resolved, resolutionRate, agents: data?.agentWorkload.length ?? 0 };
  }, [data]);

  if (isError) return <ErrorState message="Could not load live analytics." onRetry={() => refetch()} />;

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
          <Badge tone="accent">{isPending ? 'Syncing data' : 'Live workspace data'}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<TicketCheck className="h-5 w-5" />} label="Total tickets" value={formatCompactNumber(metrics.total)} />
        <Metric icon={<Clock3 className="h-5 w-5" />} label="Avg resolution" value={data ? formatHours(data.avgResolutionHours) : '—'} />
        <Metric icon={<BarChart3 className="h-5 w-5" />} label="Resolution rate" value={`${metrics.resolutionRate}%`} />
        <Metric icon={<UsersRound className="h-5 w-5" />} label="Active agents" value={metrics.agents} />
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
            <p className="text-sm text-ink-500 dark:text-ink-400">{metrics.resolved} tickets are currently resolved across the workspace.</p>
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
            <p className="text-sm text-ink-500 dark:text-ink-400">{metrics.agents} team members are represented in the current workload view.</p>
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
            <p className="text-sm text-ink-500 dark:text-ink-400">Use the live dashboard for service signals, queue health, and SLA warnings.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300">{icon}</div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">{label}</p>
        <p className="text-2xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
      </CardBody>
    </Card>
  );
}
