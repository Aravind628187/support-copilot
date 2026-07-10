import { z } from 'zod';

export const ticketStatusEnum = z.enum(['OPEN', 'PENDING', 'RESOLVED', 'CLOSED']);
export const ticketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3, 'Subject is too short').max(200),
  description: z.string().trim().min(1, 'Description is required').max(10_000),
  customerId: z.string().min(1, 'Select a customer'),
  priority: ticketPriorityEnum.default('MEDIUM'),
  assigneeId: z.string().min(1).optional(),
});

export const updateTicketSchema = z.object({
  subject: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(1).max(10_000).optional(),
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  assigneeId: z.string().min(1).nullable().optional(),
});

export const listTicketsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  assigneeId: z.string().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const bulkCloseSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'Select at least one ticket').max(200),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
