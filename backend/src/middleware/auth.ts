import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/tokens';
import { prisma } from '../lib/prisma';

/**
 * Requires a valid access token cookie. Loads a fresh copy of the user's
 * role/verification status on every request instead of trusting the JWT
 * claims blindly — a role change or deactivation takes effect immediately
 * rather than waiting for the token to expire.
 */
export function requireAuth() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken as string | undefined;
      if (!token) throw ApiError.unauthorized();

      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, isEmailVerified: true, deletedAt: true },
      });

      if (!user || user.deletedAt) throw ApiError.unauthorized();

      req.user = { id: user.id, role: user.role, isEmailVerified: user.isEmailVerified };
      next();
    } catch {
      next(ApiError.unauthorized('Your session has expired — please log in again'));
    }
  };
}

/** Gates write actions (creating tickets, sending replies, etc.) behind email verification. */
export function requireVerified() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.isEmailVerified) {
      return next(ApiError.forbidden('Please verify your email before doing that'));
    }
    next();
  };
}
