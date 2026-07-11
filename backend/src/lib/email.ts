import { logger } from './logger';


export async function sendVerificationEmail(to: string, link: string) {
  logger.info('📧 [dev email] Verify your email', { to, link });
}

export async function sendPasswordResetEmail(to: string, link: string) {
  logger.info('📧 [dev email] Reset your password', { to, link });
}
