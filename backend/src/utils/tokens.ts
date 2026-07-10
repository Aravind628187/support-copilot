import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { Role } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string; // user id
  role: Role;
  tokenVersion?: number;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.ACCESS_TOKEN_TTL_MIN}m`,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
}

/**
 * Single-use tokens (password reset, email verification) are generated as
 * random bytes, sent to the user as the raw value, and stored only as a
 * SHA-256 hash — so a leaked database never exposes a usable token.
 */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function refreshTokenExpiry(): Date {
  return new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
