import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as service from './assistant.service';
import { chatRequestSchema } from './assistant.schema';
import { ApiError } from '../../utils/apiError';

export async function chatHandler(req: Request, res: Response) {
  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Invalid request');

  const userId = req.user?.id ?? null;

  const reply = await service.chat(parsed.data.messages, userId);

  res.json({ reply });
}

export default {
  chatHandler,
};
