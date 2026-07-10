import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { env } from '../config/env';

// Keyed by IP + the email/account being targeted, so an attacker can't
// spread guesses across accounts to dodge a purely IP-based limit, and one
// noisy IP can't lock out every account behind a shared NAT.
function keyByIpAndAccount(req: Request): string {
  const account = (req.body?.email as string | undefined)?.toLowerCase() ?? 'unknown';
  return `${req.ip}:${account}`;
}

export const loginLimiter = rateLimit({
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByIpAndAccount,
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Too many attempts — try again later' } },
});

export const passwordResetLimiter = rateLimit({
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByIpAndAccount,
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Too many attempts — try again later' } },
});

// AI calls cost real money per request, so this is deliberately stricter
// than ordinary write endpoints.
export const aiDraftLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'AI draft limit reached — try again in an hour' },
  },
});

export const generalWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
