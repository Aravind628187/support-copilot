import { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { ApiError } from '../utils/apiError';

/**
 * Role checks always run server-side against `req.user`, which was loaded
 * from the database by requireAuth — never against a role the client sends.
 * A role sent in a request body or header is ignored everywhere in this API.
 */
export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowed.includes(req.user.role)) {
      return next(ApiError.forbidden('This action requires a higher role'));
    }
    next();
  };
}
