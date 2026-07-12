import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Activity, Clock3, Inbox, Sparkles, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { fetchDashboardSummary } from '../api/users';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { DashboardCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { Seo } from '../components/Seo';
import { formatCompactNumber, formatHours } from '../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#3654D1',
  PENDING: '#D97706',
  RESOLVED: '#16A34A',
  CLOSED: '#8891A0',
};

export function DashboardPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  if (isError) {
    return <ErrorState message="Could not load the dashboard." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Dashboard" description="Ticket volume, resolution time, and agent workload at a glance." />
      <div className="rounded-3xl border border-ink-200/70 bg-gradient-to-br from-accent-600 via-accent-500 to-violet-600 p-6 text-white shadow-[0_30px_80px_-35px_rgba(54,84,209,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Executive view
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Support operations, elevated.</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/80">
                Track queue health, response performance, and team capacity from one polished workspace.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <p className="text-white/70">Today’s pulse</p>
            <p className="mt-1 font-semibold">{formatCompactNumber(data?.openTicketsCount ?? 0)} active conversations</p>
          </div>
        </div>
      </div>

      {isPending || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Inbox className="h-4 w-4" />}
              label="Open + pending"
              value={String(data.openTicketsCount)}
            />
            <StatCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Avg. resolution time"
              value={formatHours(data.avgResolutionHours)}
            />
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Agents with open tickets"
              value={String(data.agentWorkload.filter((a) => a.openCount > 0).length)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">Tickets created — last 14 days</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Demand trend across your support queue.</p>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.ticketsOverTime}>
                    <defs>
                      <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3654D1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3654D1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d: string) => d.slice(5)}
                      tick={{ fontSize: 11, fill: '#8891A0' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#8891A0' }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E4E7EC' }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3654D1"
                      fill="url(#volumeFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">By priority</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Critical work at a glance.</p>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.ticketsByPriority} layout="vertical" margin={{ left: 8 }}>
                    <XAxis type="number" allowDecimals={false} hide />
                    <YAxis
                      type="category"
                      dataKey="priority"
                      tick={{ fontSize: 11, fill: '#8891A0' }}
                      axisLine={false}
                      tickLine={false}
                      width={64}
                    />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#3654D1" barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">By status</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">How the queue is flowing today.</p>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                {data.ticketsByStatus.map((row) => {
                  const total = data.ticketsByStatus.reduce((sum, r) => sum + r.count, 0) || 1;
                  const pct = Math.round((row.count / total) * 100);
                  return (
                    <div key={row.status} className="flex items-center gap-3 text-sm">
                      <span className="w-20 shrink-0 text-ink-600 dark:text-ink-400">{row.status}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-ink-100 dark:bg-ink-800">
                        <div
                          className="h-full rounded-pill"
                          style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[row.status] }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs text-ink-600 dark:text-ink-400">
                        {row.count}
                      </span>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <h2 className="text-sm font-semibold">Agent workload</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Open tickets by teammate.</p>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                {data.agentWorkload.length === 0 ? (
                  <p className="text-sm text-ink-400">No agents yet.</p>
                ) : (
                  data.agentWorkload.map((agent) => (
                    <div key={agent.agentId} className="flex items-center justify-between text-sm">
                      <span className="text-ink-800 dark:text-ink-100">{agent.name}</span>
                      <span className="font-mono text-xs text-ink-600 dark:text-ink-400">
                        {agent.openCount} open
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
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
      <div className="h-56 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-800" />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="overflow-hidden">
      <CardBody className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
            {icon}
          </div>
          <div className="rounded-full bg-ink-100 p-1.5 text-ink-400 dark:bg-ink-800">
            <Activity className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">
          {label}
        </div>
        <p className="font-mono text-2xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
      </CardBody>
    </Card>
  );
}
