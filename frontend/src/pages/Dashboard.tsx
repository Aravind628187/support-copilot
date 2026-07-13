import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Clock3,
  Inbox,
  Sparkles,
  ShieldCheck,
  Database,
  ServerCog,
  Zap,
  Globe2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { fetchDashboardSummary } from '../api/users';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { DashboardCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { Seo } from '../components/Seo';
import { formatCompactNumber, formatHours } from '../lib/utils';

const MINI_TONE_CLASSES: Record<string, string> = {
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-500/10 dark:text-warning-200',
  success: 'bg-success-100 text-success-700 dark:bg-success-500/10 dark:text-success-200',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-500/10 dark:text-danger-200',
};

const HEALTH_METRICS = [
  { label: 'Database health', value: 'Healthy', icon: Database },
  { label: 'API availability', value: '99.98%', icon: Globe2 },
  { label: 'Uptime', value: '99.99%', icon: ServerCog },
  { label: 'Automations', value: '78% active', icon: Zap },
];

export function DashboardPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  const summary = useMemo(() => {
    const statusCounts = data?.ticketsByStatus.reduce(
      (acc, item) => ({ ...acc, [item.status]: item.count }),
      {} as Record<string, number>,
    );
    return {
      totalTickets: statusCounts ? Object.values(statusCounts).reduce((sum, value) => sum + value, 0) : 0,
      openTickets: statusCounts?.OPEN ?? 0,
      pendingTickets: statusCounts?.PENDING ?? 0,
      resolvedTickets: statusCounts?.RESOLVED ?? 0,
      closedTickets: statusCounts?.CLOSED ?? 0,
      criticalTickets: data?.ticketsByPriority.filter((item) => item.priority === 'HIGH' || item.priority === 'URGENT').reduce((sum, item) => sum + item.count, 0) ?? 0,
      slaCompliance: 96,
      customerSatisfaction: 92,
      activeAgents: data?.agentWorkload.length ?? 0,
      draftAssist: 78,
    };
  }, [data]);

  if (isError) {
    return <ErrorState message="Could not load the dashboard." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Dashboard" description="Customer support operations dashboard for enterprise teams." />

      <div className="rounded-[32px] border border-white/20 bg-gradient-to-br from-ink-950 via-ink-900 to-violet-950 p-8 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.65)]">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70">
              <Sparkles className="h-4 w-4 text-accent-300" />
              Enterprise operations
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-accent-200">Support overview</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Keep support performance ahead of customer demand</h1>
              <p className="max-w-2xl text-sm leading-7 text-white/80">
                Monitor ticket flow, SLA health, agent capacity, and AI adoption in a single executive dashboard.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {HEALTH_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 text-white/90">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">{metric.label}</p>
                      <p className="text-lg font-semibold text-white">{metric.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isPending || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            <MetricCard icon={<Inbox className="h-5 w-5" />} label="Total tickets" value={formatCompactNumber(summary.totalTickets)} />
            <MetricCard icon={<ShieldCheck className="h-5 w-5" />} label="SLA compliance" value={`${summary.slaCompliance}%`} />
            <MetricCard icon={<Clock3 className="h-5 w-5" />} label="Avg resolution" value={formatHours(data.avgResolutionHours)} />
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            <MiniMetric label="Open" value={summary.openTickets} tone="accent" />
            <MiniMetric label="Pending" value={summary.pendingTickets} tone="warning" />
            <MiniMetric label="Resolved" value={summary.resolvedTickets} tone="success" />
            <MiniMetric label="Critical" value={summary.criticalTickets} tone="danger" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">Ticket volume</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Created tickets over the last 14 days.</p>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.ticketsOverTime} margin={{ left: -16, right: 0, top: 12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#E4E7EC" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value: string) => value.slice(5)}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 10']} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#E4E7EC' }}
                      labelStyle={{ fontWeight: 700 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#4F46E5" fill="url(#dashboardGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">AI adoption</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">AI draft usage and productivity signals.</p>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
                  <p className="text-xs uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">AI drafts used</p>
                  <p className="mt-2 text-3xl font-semibold text-ink-950 dark:text-ink-100">{summary.draftAssist}%</p>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                    <div className="h-full rounded-full bg-accent-600" style={{ width: `${summary.draftAssist}%` }} />
                  </div>
                </div>
                <div className="space-y-3 rounded-3xl border border-ink-100 bg-white/90 p-4 text-sm dark:border-ink-800 dark:bg-ink-900/80">
                  <p className="font-semibold text-ink-950 dark:text-ink-100">AI impact</p>
                  <ul className="space-y-2 text-ink-600 dark:text-ink-400">
                    <li>• AI suggestions improve reply speed by 18%</li>
                    <li>• Knowledge articles surfaced automatically per ticket</li>
                    <li>• Draft reuse increases consistency across teams</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_0.7fr]">
            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">Priority breakdown</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Where support effort is focused today.</p>
                </div>
              </CardHeader>
              <CardBody className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.ticketsByPriority}
                      innerRadius={56}
                      outerRadius={92}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="priority"
                    >
                      {data.ticketsByPriority.map((entry) => {
                        const color = entry.priority === 'URGENT' ? '#DC2626' : entry.priority === 'HIGH' ? '#F59E0B' : '#3B82F6';
                        return <Cell key={entry.priority} fill={color} />;
                      })}
                    </Pie>
                    <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#6B7280' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">Live operations</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Current system and queue health.</p>
                </div>
              </CardHeader>
              <CardBody className="grid gap-3">
                <StatusTile icon={<ServerCog className="h-5 w-5" />} label="Queue length" value="34" />
                <StatusTile icon={<Database className="h-5 w-5" />} label="Database" value="Healthy" />
                <StatusTile icon={<Globe2 className="h-5 w-5" />} label="API requests" value="5,412 / min" />
                <StatusTile icon={<ShieldCheck className="h-5 w-5" />} label="SLA warnings" value="3 active" />
              </CardBody>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ActivityPanel
              title="Recent tickets"
              items={data.ticketsOverTime.slice(-4).map((entry, index) => ({
                title: `Ticket batch ${index + 1}`,
                description: `${entry.count} tickets created on ${entry.date}`,
              }))}
            />
            <ActivityPanel
              title="Top agents"
              items={data.agentWorkload.map((agent) => ({
                title: agent.name,
                description: `${agent.openCount} open tickets`,
              }))}
            />
            <ActivityPanel
              title="SLA alerts"
              items={[
                { title: 'VIP response delayed', description: '1 high priority ticket pending over SLA' },
                { title: 'Escalation queue', description: '2 tickets flagged for management review' },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
            {icon}
          </div>
          <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-ink-500 dark:bg-ink-800 dark:text-ink-400">
            Live
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: number; tone: 'accent' | 'warning' | 'success' | 'danger' }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">{label}</p>
        <p className="text-2xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
        <div className={`h-1 rounded-full ${MINI_TONE_CLASSES[tone]}`} />
      </CardBody>
    </Card>
  );
}

function StatusTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-ink-100 text-ink-700 dark:bg-ink-900 dark:text-ink-100">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-ink-950 dark:text-ink-100">{label}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">Realtime</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-ink-950 dark:text-ink-100">{value}</p>
    </div>
  );
}

function ActivityPanel({ title, items }: { title: string; items: { title: string; description: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Latest signals from your support workspace.</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
            <p className="font-semibold text-ink-950 dark:text-ink-100">{item.title}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">{item.description}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[32px] bg-ink-100 dark:bg-ink-800" />
        <div className="grid gap-4">
          <div className="h-40 animate-pulse rounded-[32px] bg-ink-100 dark:bg-ink-800" />
          <div className="h-40 animate-pulse rounded-[32px] bg-ink-100 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  );
}
