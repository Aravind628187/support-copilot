import { api } from './client';
import type { PagedResult, Ticket, TicketMessage, TicketPriority, TicketStatus } from '../types';

export interface TicketListParams {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  sort?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export async function listTickets(params: TicketListParams) {
  const { data } = await api.get<PagedResult<Ticket>>('/tickets', { params });
  return data;
}

export async function getTicket(id: string) {
  const { data } = await api.get<Ticket>(`/tickets/${id}`);
  return data;
}

export async function createTicket(input: {
  subject: string;
  description: string;
  customerId: string;
  priority: TicketPriority;
  assigneeId?: string;
}) {
  const { data } = await api.post<Ticket>('/tickets', input);
  return data;
}

export async function updateTicket(
  id: string,
  input: Partial<{
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assigneeId: string | null;
  }>,
) {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, input);
  return data;
}

export async function deleteTicket(id: string) {
  await api.delete(`/tickets/${id}`);
}

export async function bulkCloseTickets(ids: string[]) {
  const { data } = await api.post<{ closedCount: number; skippedCount: number }>(
    '/tickets/bulk-close',
    { ids },
  );
  return data;
}

export function ticketsExportCsvUrl(params: TicketListParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  return `/api/tickets/export.csv?${search.toString()}`;
}

export async function listMessages(ticketId: string) {
  const { data } = await api.get<TicketMessage[]>(`/tickets/${ticketId}/messages`);
  return data;
}

export async function sendMessage(ticketId: string, body: string) {
  const { data } = await api.post<TicketMessage>(`/tickets/${ticketId}/messages`, { body });
  return data;
}

export async function generateDraftReply(ticketId: string) {
  const { data } = await api.post<{ message: TicketMessage; groundedOn: string[] }>(
    `/tickets/${ticketId}/messages/draft`,
  );
  return data;
}

export async function sendOrEditMessage(ticketId: string, messageId: string, body: string) {
  const { data } = await api.patch<TicketMessage>(
    `/tickets/${ticketId}/messages/${messageId}`,
    { body },
  );
  return data;
}
