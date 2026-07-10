export type Role = 'ADMIN' | 'AGENT';
export type TicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MessageAuthorType = 'CUSTOMER' | 'AGENT' | 'AI_DRAFT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorType: MessageAuthorType;
  authorId: string | null;
  author: { id: string; name: string } | null;
  body: string;
  isAiDraft: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  customer: { id: string; name: string; email: string; company: string | null };
  assigneeId: string | null;
  assignee: { id: string; name: string; email: string } | null;
  messages?: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  author?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardSummary {
  ticketsByStatus: { status: TicketStatus; count: number }[];
  ticketsByPriority: { priority: TicketPriority; count: number }[];
  openTicketsCount: number;
  avgResolutionHours: number;
  ticketsOverTime: { date: string; count: number }[];
  agentWorkload: { agentId: string; name: string; openCount: number }[];
}

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
