import { z } from 'zod';

export const createMessageSchema = z.object({
  body: z.string().trim().min(1, 'Message cannot be empty').max(10_000),
});

export const updateMessageSchema = z.object({
  body: z.string().trim().min(1).max(10_000),
});

export const ticketIdParamSchema = z.object({ ticketId: z.string().min(1) });
export const messageParamsSchema = z.object({
  ticketId: z.string().min(1),
  messageId: z.string().min(1),
});
