import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { recordAudit } from '../audit/audit.service';
import { ApiError } from '../../utils/apiError';

const router = Router();

router.use(requireAuth());

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true, role: true, isEmailVerified: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  }),
);

const roleParamsSchema = z.object({ id: z.string().min(1) });
const roleBodySchema = z.object({ role: z.enum(['ADMIN', 'AGENT']) });

router.patch(
  '/:id/role',
  requireRole('ADMIN'),
  validate({ params: roleParamsSchema, body: roleBodySchema }),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.id) {
      throw ApiError.badRequest('You cannot change your own role');
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true },
    });
    await recordAudit({
      actorId: req.user!.id,
      action: 'user.role_change',
      entityType: 'User',
      entityId: user.id,
      metadata: { newRole: req.body.role },
    });
    res.json(user);
  }),
);

export default router;
