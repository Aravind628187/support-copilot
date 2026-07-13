import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../lib/logger';
import { isProduction } from '../config/env';
import { AiNotConfiguredError } from '../lib/gemini';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `No route for ${req.method} ${req.path}` },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error(err.message, { code: err.code, path: req.path, stack: err.stack });
    }
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof AiNotConfiguredError) {
    return res.status(503).json({
      error: { code: 'AI_UNAVAILABLE', message: err.message },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: { code: 'CONFLICT', message: 'A record with that value already exists' },
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    }
  }

  // Anything unrecognized: log the full stack server-side, return a safe
  // message client-side. Never leak stack traces or internals in production.
  logger.error('Unhandled error', {
    path: req.path,
    message: (err as Error)?.message,
    stack: (err as Error)?.stack,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong on our end — please try again',
      ...(isProduction ? {} : { debug: (err as Error)?.message }),
    },
  });
}
