import { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Express 4 does not forward rejected promises to the error handler on its
// own — every async controller gets wrapped in this so a thrown error becomes
// a 500 with a logged stack trace instead of an unhandled rejection.
export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
