import { PrismaClient } from '@prisma/client';
import { isProduction } from '../config/env';

// Reuse a single PrismaClient across hot reloads in dev so we don't exhaust
// the Postgres connection pool every time tsx watch restarts the process.
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: isProduction ? ['error', 'warn'] : ['warn', 'error'],
  });

if (!isProduction) {
  global.__prisma__ = prisma;
}
