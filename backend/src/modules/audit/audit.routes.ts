import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { parsePageParams, buildPagedResult } from '../../utils/pagination';

const router = Router();

const listQuerySchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

router.get(
  '/',
  requireAuth(),
  requireRole('ADMIN'),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    const { entityType, entityId } = req.query as Record<string, string | undefined>;
    const pageParams = parsePageParams(req.query as Record<string, unknown>);

    const where = {
      ...(entityType ? { entityType } : {}),
      ...(entityId ? { entityId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { actor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: pageParams.skip,
        take: pageParams.take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json(buildPagedResult(items, total, pageParams));
  }),
);

export default router;
