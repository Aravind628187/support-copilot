import { api } from './client';
import type { User } from '../types';

export async function signup(input: { name: string; email: string; password: string }) {
  const { data } = await api.post<{ user: User; message: string }>('/auth/signup', input);
  return data;
}

export async function login(input: { email: string; password: string }) {
  const { data } = await api.post<{ user: User }>('/auth/login', input);
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function fetchMe() {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return data.message;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', { token, password });
  return data.message;
}

export async function verifyEmail(token: string) {
  const { data } = await api.post<{ message: string }>('/auth/verify-email', { token });
  return data.message;
}
