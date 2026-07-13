import { api, API_BASE_URL } from './client';
import type { Customer, PagedResult } from '../types';

export async function listCustomers(params: { search?: string; page?: number }) {
  const { data } = await api.get<PagedResult<Customer>>('/customers', { params });
  return data;
}

export async function getCustomer(id: string) {
  const { data } = await api.get<Customer>(`/customers/${id}`);
  return data;
}

export async function createCustomer(input: { name: string; email: string; company?: string }) {
  const { data } = await api.post<Customer>('/customers', input);
  return data;
}

export function customersExportCsvUrl(search?: string) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  return `${API_BASE_URL}/customers/export.csv?${params.toString()}`;
}
