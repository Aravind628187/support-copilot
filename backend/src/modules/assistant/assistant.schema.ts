import { z } from 'zod';

export const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
