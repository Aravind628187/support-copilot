import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/tokens';

export function requireAuth() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.cookies?.accessToken as string | undefined;

      if (!token) {
        throw ApiError.unauthorized();
      }

      const payload = verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
        select: {
          id: true,
          role: true,
          isEmailVerified: true,
          deletedAt: true,
        },
      });

      if (!user || user.deletedAt) {
        throw ApiError.unauthorized();
      }

      req.user = {
        id: user.id,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };

      next();
    } catch {
      next(
        ApiError.unauthorized(
          'Your session has expired — please log in again',
        ),
      );
    }
  };
}

export function requireVerified() {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user?.isEmailVerified) {
      return next(
        ApiError.forbidden(
          'Please verify your email before doing that',
        ),
      );
    }

    next();
  };
}