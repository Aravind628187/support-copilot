import { Response } from 'express';
import { env, isProduction } from '../config/env';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction, // requires HTTPS in production; localhost stays over http in dev
  sameSite: 'lax' as const,
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: env.ACCESS_TOKEN_TTL_MIN * 60 * 1000,
    path: '/',
  });
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    // Scoped to /api/auth so it's only ever sent to refresh/logout, never to
    // ordinary API calls — but still reaches logout so it can be revoked.
    path: '/api/auth',
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { ...baseCookieOptions, path: '/' });
  res.clearCookie('refreshToken', { ...baseCookieOptions, path: '/api/auth' });
}
