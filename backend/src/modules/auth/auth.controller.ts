import { Request, Response } from 'express';
import { setAuthCookies, clearAuthCookies } from '../../lib/cookies';
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
