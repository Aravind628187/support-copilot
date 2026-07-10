import { api } from './client';
import type { Customer, PagedResult } from '../types';

export async function listCustomers(params: { search?: string; page?: number }) {
  const { data } = await api.get<PagedResult<Customer>>('/customers', { params });
  return data;
}

export async function createCustomer(input: { name: string; email: string; company?: string }) {
  const { data } = await api.post<Customer>('/customers', input);
  return data;
}
