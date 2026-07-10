import { Router } from 'express';
import { requireAuth, requireVerified } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { aiDraftLimiter } from '../../middleware/rateLimit';
import { asyncHandler } from '../../utils/asyncHandler';
import { recordAudit } from '../audit/audit.service';
import { AiNotConfiguredError } from '../../lib/gemini';
import {
  createMessageSchema,
  messageParamsSchema,
  ticketIdParamSchema,
  updateMessageSchema,
} from './messages.schema';
import * as service from './messages.service';

// mergeParams lets this router read :ticketId from the parent mount
const router = Router({ mergeParams: true });

router.use(requireAuth());

router.get(
  '/',
  validate({ params: ticketIdParamSchema }),
  asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId!;

    const messages = await service.listMessages(ticketId);

    res.json(messages);
  }),
);

router.post(
  '/',
  requireVerified(),
  validate({
    params: ticketIdParamSchema,
    body: createMessageSchema,
  }),
  asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId!;

    const message = await service.addAgentMessage(
      ticketId,
      req.user!.id,
      req.body.body,
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'message.create',
      entityType: 'TicketMessage',
      entityId: message.id,
      metadata: {
        ticketId,
      },
    });

    res.status(201).json(message);
  }),
);

router.post(
  '/draft',
  requireVerified(),
  aiDraftLimiter,
  validate({ params: ticketIdParamSchema }),
  asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId!;

    try {
      const { message, groundedOn } =
        await service.generateDraftReply(ticketId);

      await recordAudit({
        actorId: req.user!.id,
        action: 'message.ai_draft_generated',
        entityType: 'TicketMessage',
        entityId: message.id,
        metadata: {
          ticketId,
          groundedOn,
        },
      });

      res.status(201).json({
        message,
        groundedOn,
      });
    } catch (error) {
      if (error instanceof AiNotConfiguredError) {
        return res.status(503).json({
          error: {
            code: 'AI_NOT_CONFIGURED',
            message: error.message,
          },
        });
      }

      throw error;
    }
  }),
);

router.patch(
  '/:messageId',
  requireVerified(),
  validate({
    params: messageParamsSchema,
    body: updateMessageSchema,
  }),
  asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId!;
    const messageId = req.params.messageId!;

    const message = await service.sendOrEditMessage(
      ticketId,
      messageId,
      req.user!.id,
      req.body.body,
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'message.send',
      entityType: 'TicketMessage',
      entityId: message.id,
      metadata: {
        ticketId,
      },
    });

    res.json(message);
  }),
);

export default router;