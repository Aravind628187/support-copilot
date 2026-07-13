import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { setAuthCookies, clearAuthCookies, clearGoogleOAuthStateCookie, setGoogleOAuthStateCookie } from '../../lib/cookies';
import { frontendUrl } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import * as authService from './auth.service';

export async function signupHandler(req: Request, res: Response) {
  const user = await authService.signup(req.body);
  res.status(201).json({
    user,
    message: 'Account created — check the server log for your verification link (dev mode).',
  });
}

export async function loginHandler(req: Request, res: Response) {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user });
}

export async function refreshHandler(req: Request, res: Response) {
  const presented = req.cookies?.refreshToken as string | undefined;
  const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(presented ?? '');
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user });
}

export async function logoutHandler(req: Request, res: Response) {
  const presented = req.cookies?.refreshToken as string | undefined;
  await authService.logout(presented);
  clearAuthCookies(res);
  res.status(204).send();
}

function redirectToLogin(res: Response, oauth: 'success' | 'error') {
  const url = new URL('/login', frontendUrl);
  url.searchParams.set('oauth', oauth);
  res.redirect(url.toString());
}

export async function googleStartHandler(_req: Request, res: Response) {
  const state = crypto.randomBytes(32).toString('hex');
  setGoogleOAuthStateCookie(res, state);
  res.redirect(authService.googleAuthorizationUrl(state));
}

export async function googleCallbackHandler(req: Request, res: Response) {
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const expectedState = req.cookies?.googleOAuthState as string | undefined;
  clearGoogleOAuthStateCookie(res);

  if (
    !state ||
    !expectedState ||
    state.length !== expectedState.length ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(expectedState))
  ) {
    throw ApiError.unauthorized('Google sign-in could not be verified. Please try again.');
  }

  if (req.query.error || typeof req.query.code !== 'string') {
    redirectToLogin(res, 'error');
    return;
  }

  const { accessToken, refreshToken } = await authService.loginWithGoogle(req.query.code);
  setAuthCookies(res, accessToken, refreshToken);
  redirectToLogin(res, 'success');
}

export async function meHandler(req: Request, res: Response) {
  const user = await authService.getCurrentUser(req.user!.id);
  res.json({ user });
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  await authService.requestPasswordReset(req.body.email);
  // Same response whether or not the email exists.
  res.json({ message: 'If that email is registered, a reset link has been sent.' });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  await authService.resetPassword(req.body.token, req.body.password);
  res.json({ message: 'Password updated — please log in again.' });
}

export async function verifyEmailHandler(req: Request, res: Response) {
  await authService.verifyEmail(req.body.token);
  res.json({ message: 'Email verified.' });
}

export async function listSessionsHandler(req: Request, res: Response) {
  const sessions = await authService.listSessions(req.user!.id);
  res.json({ sessions });
}

export async function revokeSessionHandler(req: Request, res: Response) {
  const { sessionId } = req.params as { sessionId: string };
  await authService.revokeSession(req.user!.id, sessionId);
  res.status(204).send();
}
