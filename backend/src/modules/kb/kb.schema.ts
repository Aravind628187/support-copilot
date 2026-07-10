import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  content: z.string().trim().min(1).max(20_000),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
});

export const updateArticleSchema = createArticleSchema.partial();

export const listArticlesQuerySchema = z.object({
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
