import { Response } from 'express';
import { env, isProduction } from '../config/env';

const baseCookieOptions = {
  httpOnly: true,
  // Secure cookies are required when the frontend and API live on separate
  // production origins. Local HTTP development cannot store Secure cookies.
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
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

const googleStateCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/api/auth/google',
};

export function setGoogleOAuthStateCookie(res: Response, state: string) {
  res.cookie('googleOAuthState', state, {
    ...googleStateCookieOptions,
    maxAge: 10 * 60 * 1000,
  });
}

export function clearGoogleOAuthStateCookie(res: Response) {
  res.clearCookie('googleOAuthState', googleStateCookieOptions);
}
