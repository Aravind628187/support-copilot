import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  // Assumes `npm run dev` (frontend) and the backend + a seeded database are
  // already running — see README > Testing for the exact commands.
});
