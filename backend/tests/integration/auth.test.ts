import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

const app = createApp();

const testEmail = `agent-${Date.now()}@example.test`;
const testPassword = 'Sup3rSecret!Pass';

describe('auth flow', () => {
  afterAll(async () => {
    const users = await prisma.user.findMany({
      where: {
        email: testEmail,
      },
      select: {
        id: true,
      },
    });

    const userIds = users.map((u) => u.id);

    if (userIds.length > 0) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });

      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });

      await prisma.emailVerificationToken.deleteMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });

      await prisma.auditLog.deleteMany({
        where: {
          actorId: {
            in: userIds,
          },
        },
      });

      await prisma.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
    }

    await prisma.$disconnect();
  });

  it('signs a new user up (happy path)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Agent',
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects signup with a weak password (boundary case)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Weak Pw',
        email: `weak-${Date.now()}@example.test`,
        password: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('rejects signup for an email that already exists (failure mode)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Dup',
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials and sets an httpOnly cookie (happy path)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);

    expect(
      res.headers['set-cookie']?.some((cookie: string) =>
        cookie.startsWith('accessToken=')
      )
    ).toBe(true);
  });

  it('rejects login with the wrong password without revealing which field was wrong (failure mode)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'totally-wrong',
      });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  it('returns the current user from /me when authenticated', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    const res = await agent.get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });

  it('rejects /me with no session (failure mode)', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});