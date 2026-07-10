import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as service from './dashboard.service';

const router = Router();

router.get(
  '/summary',
  requireAuth(),
  asyncHandler(async (_req, res) => {
    res.json(await service.getSummary());
  }),
);

export default router;
