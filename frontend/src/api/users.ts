import { api } from './client';
import type { DashboardSummary, Role, User } from '../types';

export async function listUsers() {
  const { data } = await api.get<User[]>('/users');
  return data;
}

export async function updateUserRole(id: string, role: Role) {
  const { data } = await api.patch<User>(`/users/${id}/role`, { role });
  return data;
}

export async function fetchDashboardSummary() {
  const { data } = await api.get<DashboardSummary>('/dashboard/summary');
  return data;
}
