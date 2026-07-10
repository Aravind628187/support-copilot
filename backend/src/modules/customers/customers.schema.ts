import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().toLowerCase().email(),
  company: z.string().trim().max(150).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const listCustomersQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
