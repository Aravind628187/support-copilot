import { logger } from './logger';

/**
 * No SMTP/Resend/SendGrid provider is wired up for this trial project — every
 * "email" is written to the server log instead so the whole auth flow (reset,
 * verify) is testable without external accounts. Swap the body of these two
 * functions for a real provider call before using this in production; every
 * call site elsewhere in the app stays the same.
 */
export async function sendVerificationEmail(to: string, link: string) {
  logger.info('📧 [dev email] Verify your email', { to, link });
}

export async function sendPasswordResetEmail(to: string, link: string) {
  logger.info('📧 [dev email] Reset your password', { to, link });
}
