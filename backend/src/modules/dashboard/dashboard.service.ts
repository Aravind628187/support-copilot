import { prisma } from '../../lib/prisma';

const TREND_DAYS = 14;

export async function getSummary() {
  const [byStatus, byPriority, openCount, resolvedTickets, agents, workloadRows] = await Promise.all([
    prisma.ticket.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ['priority'],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
    prisma.ticket.count({ where: { deletedAt: null, status: { in: ['OPEN', 'PENDING'] } } }),
    prisma.ticket.findMany({
      where: { deletedAt: null, resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
      take: 500,
      orderBy: { resolvedAt: 'desc' },
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
    // A plain groupBy (rather than a filtered relation count under
    // `_count.select`) keeps this on the stable, version-independent part of
    // the Prisma API.
    prisma.ticket.groupBy({
      by: ['assigneeId'],
      where: { deletedAt: null, status: { in: ['OPEN', 'PENDING'] }, assigneeId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const openCountByAgent = new Map<string, number>();
  for (const row of workloadRows) {
    if (row.assigneeId) openCountByAgent.set(row.assigneeId, row._count._all);
  }

  const since = new Date();
  since.setDate(since.getDate() - (TREND_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const recentTickets = await prisma.ticket.findMany({
    where: { deletedAt: null, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const trendMap = new Map<string, number>();
  for (let i = 0; i < TREND_DAYS; i += 1) {
    const day = new Date(since);
    day.setDate(day.getDate() + i);
    trendMap.set(day.toISOString().slice(0, 10), 0);
  }
  for (const ticket of recentTickets) {
    const key = ticket.createdAt.toISOString().slice(0, 10);
    trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }

  const avgResolutionHours = resolvedTickets.length
    ? resolvedTickets.reduce((sum, t) => {
        const hours = (t.resolvedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0) / resolvedTickets.length
    : 0;

  return {
    ticketsByStatus: byStatus.map((row) => ({ status: row.status, count: row._count._all })),
    ticketsByPriority: byPriority.map((row) => ({ priority: row.priority, count: row._count._all })),
    openTicketsCount: openCount,
    avgResolutionHours: Math.round(avgResolutionHours * 10) / 10,
    ticketsOverTime: Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })),
    agentWorkload: agents
      .map((a) => ({ agentId: a.id, name: a.name, openCount: openCountByAgent.get(a.id) ?? 0 }))
      .sort((a, b) => b.openCount - a.openCount),
  };
}
