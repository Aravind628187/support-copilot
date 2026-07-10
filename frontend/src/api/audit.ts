import { api } from './client';

export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actor: { id: string; name: string; email: string } | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: string;
}

export async function listAuditLog(params: { entityType?: string; page?: number }) {
  const { data } = await api.get<{
    items: AuditLogEntry[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>('/audit', { params });
  return data;
}
