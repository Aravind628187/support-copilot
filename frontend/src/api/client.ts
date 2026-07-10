import axios, { AxiosError } from 'axios';
import type { ApiErrorShape } from '../types';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send/receive the httpOnly auth cookies
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<void> | null = null;

/**
 * On a 401, try exactly once to refresh the access token via the httpOnly
 * refresh cookie, then replay the original request. Concurrent 401s share a
 * single in-flight refresh call instead of each firing their own.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retried?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retried && !original.url?.includes('/auth/')) {
      original._retried = true;
      try {
        refreshPromise ??= api.post('/auth/refresh').then(() => undefined);
        await refreshPromise;
        refreshPromise = null;
        return api(original);
      } catch {
        refreshPromise = null;
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (data?.error?.message) return data.error.message;
  }
  return fallback;
}
