import crypto from 'node:crypto';
import 'dotenv/config';
import { z } from 'zod';

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function resolveDatabaseUrl(rawEnv: NodeJS.ProcessEnv = process.env) {
  const candidates = [
    rawEnv.DATABASE_URL,
    rawEnv.POSTGRES_URL,
    rawEnv.POSTGRES_PRISMA_URL,
    rawEnv.DATABASE_URL_NON_POOLING,
    rawEnv.DATABASE_URL_UNPOOLED,
    rawEnv.DB_URL,
    rawEnv.POSTGRESQL_URL,
  ];

  return candidates.find((value) => !!value?.trim())?.trim();
}

// Validate environment variables before the server starts.
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(4000),

  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z
    .string()
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters')
    .default(() => generateSecret()),

  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters')
    .default(() => generateSecret()),

  ACCESS_TOKEN_TTL_MIN: z.coerce.number().int().positive().default(15),

  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),

  // ---------- Gemini ----------
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  // ----------------------------

  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),

  LOGIN_RATE_LIMIT_WINDOW_MIN: z.coerce.number().int().positive().default(15),
});

export function parseEnv(rawEnv: NodeJS.ProcessEnv = process.env) {
  const databaseUrl = resolveDatabaseUrl(rawEnv);

  const normalizedEnv = {
    ...rawEnv,
    DATABASE_URL: databaseUrl || rawEnv.DATABASE_URL?.trim() || undefined,
    JWT_ACCESS_SECRET: rawEnv.JWT_ACCESS_SECRET?.trim() || undefined,
    JWT_REFRESH_SECRET: rawEnv.JWT_REFRESH_SECRET?.trim() || undefined,
  };

  return envSchema.safeParse(normalizedEnv);
}

const parsed = parseEnv(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === 'production';

export const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) =>
  origin.trim()
);

// Gemini is configured only if an API key exists.
export const isAiConfigured =
  env.GEMINI_API_KEY.trim().length > 0;