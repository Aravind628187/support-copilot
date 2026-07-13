import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { prisma } from './lib/prisma';
import { corsOrigins, isProduction } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import ticketRoutes from './modules/tickets/tickets.routes';
import messageRoutes from './modules/messages/messages.routes';
import kbRoutes from './modules/kb/kb.routes';
import customerRoutes from './modules/customers/customers.routes';
import userRoutes from './modules/users/users.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import auditRoutes from './modules/audit/audit.routes';
import assistantRoutes from './modules/assistant/assistant.routes';

export function createApp() {
  const app = express();

  // Trust the first proxy hop (Render/Railway/Fly/behind a load balancer) so
  // req.ip and the Secure cookie flag behave correctly in production.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });
  app.get('/ready', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready', database: 'connected', time: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'unavailable', time: new Date().toISOString() });
    }
  });
  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'SupportCopilot API is running',
      version: '1.0.0',
      health: '/health',
      readiness: '/ready',
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tickets/:ticketId/messages', messageRoutes);
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/kb', kbRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/audit', auditRoutes);
  app.use('/api/assistant', assistantRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
