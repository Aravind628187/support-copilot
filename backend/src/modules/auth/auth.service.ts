import { prisma } from '../../lib/prisma';
import { corsOrigins } from '../../config/env';
import { hashPassword, verifyPassword } from '../../utils/password';
import {
  generateRawToken,
  hashToken,
  minutesFromNow,
  refreshTokenExpiry,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/tokens';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../lib/email';
import { recordAudit } from '../audit/audit.service';
import { ApiError } from '../../utils/apiError';
import type { LoginInput, SignupInput } from './auth.schema';

const PASSWORD_RESET_TTL_MIN = 30;
const EMAIL_VERIFICATION_TTL_HOURS = 24;

function publicUser(user: { id: string; name: string; email: string; role: string; isEmailVerified: boolean }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict('An account with that email already exists');
  }

  const userCount = await prisma.user.count();
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: userCount === 0 ? 'ADMIN' : 'AGENT', // first account bootstraps as admin
    },
  });

  const rawToken = generateRawToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000),
    },
  });
  await sendVerificationEmail(user.email, `${corsOrigins[0]}/verify-email?token=${rawToken}`);
  await recordAudit({ actorId: user.id, action: 'user.signup', entityType: 'User', entityId: user.id });

  return publicUser(user);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || user.deletedAt) throw ApiError.unauthorized('Invalid email or password');

  const validPassword = await verifyPassword(input.password, user.passwordHash);
  if (!validPassword) throw ApiError.unauthorized('Invalid email or password');

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiry(),
    },
  });

  await recordAudit({ actorId: user.id, action: 'user.login', entityType: 'User', entityId: user.id });

  return { user: publicUser(user), accessToken, refreshToken };
}

export async function rotateRefreshToken(presentedToken: string) {
  try {
    verifyRefreshToken(presentedToken);
  } catch {
    throw ApiError.unauthorized('Session expired — please log in again');
  }

  const tokenHash = hashToken(presentedToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized('Session expired — please log in again');
  }

  if (stored.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: {
        userId: stored.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    throw ApiError.unauthorized('Session invalidated — please log in again');
  }

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
  });

  if (!user || user.deletedAt) {
    throw ApiError.unauthorized();
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: {
      revokedAt: new Date(),
    },
  });

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiry(),
    },
  });

  return {
    user: publicUser(user),
    accessToken,
    refreshToken,
  };
}
export async function logout(presentedToken: string | undefined) {
  if (!presentedToken) return;
  const tokenHash = hashToken(presentedToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond success-shaped to the caller (handled in controller) so we
  // don't reveal whether an email is registered.
  if (!user || user.deletedAt) return;

  const rawToken = generateRawToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: minutesFromNow(PASSWORD_RESET_TTL_MIN),
    },
  });
  await sendPasswordResetEmail(user.email, `${corsOrigins[0]}/reset-password?token=${rawToken}`);
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw ApiError.badRequest('This reset link is invalid or has expired');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    // Resetting the password invalidates every existing session.
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await recordAudit({
    actorId: record.userId,
    action: 'user.password_reset',
    entityType: 'User',
    entityId: record.userId,
  });
}

export async function verifyEmail(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw ApiError.badRequest('This verification link is invalid or has expired');
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { isEmailVerified: true } }),
    prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.unauthorized();
  return publicUser(user);
}

export async function listSessions(userId: string) {
  const sessions = await prisma.refreshToken.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt,
    status: session.revokedAt ? 'revoked' : session.expiresAt < new Date() ? 'expired' : 'active',
  }));
}

export async function revokeSession(userId: string, sessionId: string) {
  const session = await prisma.refreshToken.findUnique({ where: { id: sessionId } });

  if (!session || session.userId !== userId) {
    throw ApiError.notFound('Session not found');
  }

  if (session.revokedAt) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
}
