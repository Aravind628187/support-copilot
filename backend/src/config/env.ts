import 'dotenv/config';
import { z } from 'zod';

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
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),

  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),

  ACCESS_TOKEN_TTL_MIN: z.coerce.number().int().positive().default(15),

  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),

  // ---------- Gemini ----------
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  // ----------------------------

  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),

  LOGIN_RATE_LIMIT_WINDOW_MIN: z.coerce.number().int().positive().default(15),
});

const parsed = envSchema.safeParse(process.env);

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