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
import { Clock, Inbox, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { fetchDashboardSummary } from '../api/users';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { DashboardCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { Seo } from '../components/Seo';
import { formatHours } from '../lib/utils';

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
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-ink-600 dark:text-ink-400">
          Everything happening across your queue, at a glance.
        </p>
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
              icon={<Clock className="h-4 w-4" />}
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
                <h2 className="text-sm font-semibold">Tickets created — last 14 days</h2>
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
                <h2 className="text-sm font-semibold">By priority</h2>
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
                <h2 className="text-sm font-semibold">By status</h2>
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
                <h2 className="text-sm font-semibold">Agent workload (open tickets)</h2>
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
    <Card>
      <CardBody className="pt-4">
        <div className="mb-2 flex items-center gap-2 text-ink-400">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className="font-mono text-2xl font-semibold">{value}</p>
      </CardBody>
    </Card>
  );
}
