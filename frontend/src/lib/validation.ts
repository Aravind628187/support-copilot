import { z } from 'zod';

// These intentionally mirror backend/src/modules/*/**.schema.ts rule-for-rule.
// Because the frontend and backend are separate deployable packages (not a
// shared-package monorepo), the schemas live in two files rather than one
// import — see docs/architecture.md for that trade-off and the npm-workspace
// upgrade path if the two ever drift.

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number');

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: passwordSchema,
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ticketFormSchema = z.object({
  subject: z.string().trim().min(3, 'Subject is too short').max(200),
  description: z.string().trim().min(1, 'Description is required').max(10_000),
  customerId: z.string().min(1, 'Select a customer'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});
export type TicketFormValues = z.infer<typeof ticketFormSchema>;

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  company: z.string().trim().max(150).optional(),
});
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const articleFormSchema = z.object({
  title: z.string().trim().min(3, 'Title is too short').max(200),
  content: z.string().trim().min(1, 'Content is required').max(20_000),
  tags: z.array(z.string()).max(10),
});
export type ArticleFormValues = z.infer<typeof articleFormSchema>;
