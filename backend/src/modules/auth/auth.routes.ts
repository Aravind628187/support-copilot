import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { loginLimiter, passwordResetLimiter } from '../../middleware/rateLimit';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  sessionIdParamSchema,
} from './auth.schema';
import * as controller from './auth.controller';

const router = Router();

router.post('/signup', validate({ body: signupSchema }), asyncHandler(controller.signupHandler));
router.post(
  '/login',
  loginLimiter,
  validate({ body: loginSchema }),
  asyncHandler(controller.loginHandler),
);
router.post('/refresh', asyncHandler(controller.refreshHandler));
router.post('/logout', asyncHandler(controller.logoutHandler));
router.get('/google', asyncHandler(controller.googleStartHandler));
router.get('/google/callback', asyncHandler(controller.googleCallbackHandler));
router.get('/sessions', requireAuth(), asyncHandler(controller.listSessionsHandler));
router.delete(
  '/sessions/:sessionId',
  requireAuth(),
  validate({ params: sessionIdParamSchema }),
  asyncHandler(controller.revokeSessionHandler),
);
router.get('/me', requireAuth(), asyncHandler(controller.meHandler));
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: forgotPasswordSchema }),
  asyncHandler(controller.forgotPasswordHandler),
);
router.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  asyncHandler(controller.resetPasswordHandler),
);
router.post(
  '/verify-email',
  validate({ body: verifyEmailSchema }),
  asyncHandler(controller.verifyEmailHandler),
);

export default router;
