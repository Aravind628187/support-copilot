import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import controller from './assistant.controller';
import { chatRequestSchema } from './assistant.schema';

const router = Router();

router.post('/', requireAuth(), validate({ body: chatRequestSchema }), asyncHandler(controller.chatHandler));

export default router;
