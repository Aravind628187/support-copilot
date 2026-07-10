import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

interface Schemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Validates body/query/params against shared Zod schemas — the same schemas
 * the frontend imports, so the browser and the API reject the exact same
 * bad input instead of drifting apart over time.
 */
export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          ApiError.badRequest('Validation failed', err.flatten().fieldErrors),
        );
      }
      next(err);
    }
  };
}
