import axios, { AxiosError } from 'axios';
import type { ApiErrorShape } from '../types';

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://support-copilot-m0k5.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<void> | null = null;


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (typeof error.config & { _retried?: boolean })
      | undefined;

    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retried &&
      !original.url?.includes('/auth/')
    ) {
      original._retried = true;

      try {
        refreshPromise ??= api
          .post('/auth/refresh')
          .then(() => undefined);

        await refreshPromise;
        refreshPromise = null;

        return api(original);
      } catch {
        refreshPromise = null;
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Extract readable API error message.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;

    if (data?.error?.message) {
      return data.error.message;
    }
  }

  return fallback;
}