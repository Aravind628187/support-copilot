import { Response } from 'express';
import { env } from '../config/env';

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: env.ACCESS_TOKEN_TTL_MIN * 60 * 1000,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', {
    ...baseCookieOptions,
    path: '/',
  });

  res.clearCookie('refreshToken', {
    ...baseCookieOptions,
    path: '/',
  });
}