import { Prisma, TicketStatus, TicketPriority } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { buildPagedResult, PageParams } from '../../utils/pagination';
import { toCsv } from '../../utils/csv';

interface ListFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  sort: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  order: 'asc' | 'desc';
}

const ticketInclude = {
  customer: { select: { id: true, name: true, email: true, company: true } },
  assignee: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TicketInclude;

function buildWhere(filters: ListFilters): Prisma.TicketWhereInput {
  return {
    deletedAt: null,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
    ...(filters.search
      ? {
          OR: [
            { subject: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
            { customer: { email: { contains: filters.search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };
}

function buildOrderBy(sort: ListFilters['sort'], order: ListFilters['order']): Prisma.TicketOrderByWithRelationInput[] {
  // A computed property key typed as a string-literal union doesn't narrow
  // to Prisma's precise OrderByWithRelationInput shape, so we map explicitly
  // instead of `{ [sort]: order }`. Stable secondary sort on id stops page
  // jitter when the primary column has ties (e.g. same-second creations).
  const primary: Prisma.TicketOrderByWithRelationInput =
    sort === 'updatedAt'
      ? { updatedAt: order }
      : sort === 'priority'
        ? { priority: order }
        : sort === 'status'
          ? { status: order }
          : { createdAt: order };

  return [primary, { id: 'asc' }];
}

export async function listTickets(
  actor: { id: string; role: string },
  filters: ListFilters,
  pageParams: PageParams,
) {
  const where = buildWhere(filters);

  // Only ADMIN can see every ticket.
  // Everyone else only sees tickets assigned to them.
  if (actor.role !== 'ADMIN') {
    where.assigneeId = actor.id;
  }

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: buildOrderBy(filters.sort, filters.order),
      skip: pageParams.skip,
      take: pageParams.take,
    }),
    prisma.ticket.count({ where }),
  ]);

  return buildPagedResult(items, total, pageParams);
}

export async function exportTicketsCsv(filters: ListFilters): Promise<string> {
  const where = buildWhere(filters);
  const tickets = await prisma.ticket.findMany({
    where,
    include: ticketInclude,
    orderBy: buildOrderBy(filters.sort, filters.order),
    take: 5000, // hard cap so an unbounded export can't take down the process
  });

  const rows = tickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    customerName: t.customer.name,
    customerEmail: t.customer.email,
    assignee: t.assignee?.name ?? 'Unassigned',
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return toCsv(rows, [
    'id',
    'subject',
    'status',
    'priority',
    'customerName',
    'customerEmail',
    'assignee',
    'createdAt',
    'updatedAt',
  ]);
}

export async function getTicket(
  id: string,
  actor: { id: string; role: string },
) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      ...ticketInclude,
      messages: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  if (
    actor.role !== 'ADMIN' &&
    ticket.assigneeId !== actor.id
  ) {
    throw ApiError.forbidden(
      'You are not allowed to view this ticket',
    );
  }

  return ticket;
}

export async function createTicket(
  actor: { id: string },
  data: {
    subject: string;
    description: string;
    customerId: string;
    priority: TicketPriority;
    assigneeId?: string;
  },
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: data.customerId,
    },
  });

  if (!customer) {
    throw ApiError.badRequest('Selected customer does not exist');
  }

  if (data.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: {
        id: data.assigneeId,
      },
    });

    if (!assignee) {
      throw ApiError.badRequest('Selected assignee does not exist');
    }
  }

  return prisma.ticket.create({
    data: {
      ...data,
      // If no assignee is provided, assign the ticket to the creator.
      assigneeId: data.assigneeId ?? actor.id,
    },
    include: ticketInclude,
  });
}

export function assertCanModify(
  actor: { id: string; role: string },
  ticket: { assigneeId: string | null },
) {
  // Admin can modify anything.
  if (actor.role === 'ADMIN') {
    return;
  }

  // Agents can only modify tickets assigned to themselves.
  if (ticket.assigneeId !== actor.id) {
    throw ApiError.forbidden(
      'Only the assigned agent or an admin can modify this ticket',
    );
  }
}

export async function updateTicket(
  id: string,
  actor: { id: string; role: string },
  data: Partial<{
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assigneeId: string | null;
  }>,
) {
  const existing = await prisma.ticket.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound('Ticket not found');
  assertCanModify(actor, existing);

  if (data.assigneeId) {
    const assignee = await prisma.user.findUnique({ where: { id: data.assigneeId } });
    if (!assignee) throw ApiError.badRequest('Selected assignee does not exist');
  }

  const resolvedAt =
    data.status === 'RESOLVED' && existing.status !== 'RESOLVED' ? new Date() : existing.resolvedAt;

  return prisma.ticket.update({
    where: { id },
    data: { ...data, resolvedAt },
    include: ticketInclude,
  });
}

export async function softDeleteTicket(id: string) {
  const existing = await prisma.ticket.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw ApiError.notFound('Ticket not found');
  await prisma.ticket.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function bulkClose(ids: string[], actor: { id: string; role: string }) {
  const tickets = await prisma.ticket.findMany({ where: { id: { in: ids }, deletedAt: null } });

  const allowedIds: string[] = [];
  for (const ticket of tickets) {
    if (actor.role === 'ADMIN' || !ticket.assigneeId || ticket.assigneeId === actor.id) {
      allowedIds.push(ticket.id);
    }
  }

  if (allowedIds.length === 0) {
    return { closedCount: 0, skippedCount: ids.length };
  }

  await prisma.ticket.updateMany({
    where: { id: { in: allowedIds } },
    data: { status: 'CLOSED', resolvedAt: new Date() },
  });

  return { closedCount: allowedIds.length, skippedCount: ids.length - allowedIds.length };
}
