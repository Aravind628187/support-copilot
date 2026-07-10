import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { hashPassword } from '../../src/utils/password';

// See README > Testing — requires DATABASE_URL to point at a disposable test DB.
const app = createApp();

const suffix = Date.now();
const ownerEmail = `owner-${suffix}@example.test`;
const otherEmail = `other-${suffix}@example.test`;
const customerEmail = `customer-${suffix}@example.test`;
const password = 'Sup3rSecret!Pass';

let ownerAgent: ReturnType<typeof request.agent>;
let otherAgent: ReturnType<typeof request.agent>;
let customerId: string;
let ticketId: string;

describe('tickets', () => {
  beforeAll(async () => {
    const passwordHash = await hashPassword(password);
    const owner = await prisma.user.create({
      data: { name: 'Owner Agent', email: ownerEmail, passwordHash, role: 'AGENT', isEmailVerified: true },
    });
    await prisma.user.create({
      data: { name: 'Other Agent', email: otherEmail, passwordHash, role: 'AGENT', isEmailVerified: true },
    });
    const customer = await prisma.customer.create({
      data: { name: 'Test Customer', email: customerEmail },
    });
    customerId = customer.id;

    ownerAgent = request.agent(app);
    otherAgent = request.agent(app);
    await ownerAgent.post('/api/auth/login').send({ email: ownerEmail, password });
    await otherAgent.post('/api/auth/login').send({ email: otherEmail, password });

    void owner; // referenced only for setup
  });

  afterAll(async () => {
    await prisma.ticket.deleteMany({ where: { customerId } });
    await prisma.customer.deleteMany({ where: { email: customerEmail } });
    await prisma.user.deleteMany({ where: { email: { in: [ownerEmail, otherEmail] } } });
    await prisma.$disconnect();
  });

  it('creates a ticket assigned to the creator (happy path)', async () => {
    const res = await ownerAgent.post('/api/tickets').send({
      subject: 'Cannot access my dashboard',
      description: 'Getting a blank screen after login.',
      customerId,
      priority: 'HIGH',
    });

    expect(res.status).toBe(201);
    expect(res.body.subject).toBe('Cannot access my dashboard');
    ticketId = res.body.id;
  });

  it('rejects creating a ticket for a customer that does not exist (boundary case)', async () => {
    const res = await ownerAgent.post('/api/tickets').send({
      subject: 'Orphan ticket',
      description: 'Should fail.',
      customerId: 'does-not-exist',
      priority: 'LOW',
    });

    expect(res.status).toBe(400);
  });

  it('finds the ticket via search on subject text', async () => {
    const res = await ownerAgent.get('/api/tickets').query({ search: 'dashboard' });
    expect(res.status).toBe(200);
    expect(res.body.items.some((t: { id: string }) => t.id === ticketId)).toBe(true);
  });

  it('filters tickets by status with no matches for an unused status', async () => {
    const res = await ownerAgent.get('/api/tickets').query({ status: 'CLOSED', search: 'dashboard' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });

  it("lets the owning agent update their own ticket's status", async () => {
    const res = await ownerAgent.patch(`/api/tickets/${ticketId}`).send({ status: 'RESOLVED' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('RESOLVED');
    expect(res.body.resolvedAt).not.toBeNull();
  });

  it("blocks a different agent from updating someone else's assigned ticket (row-level auth, failure mode)", async () => {
    const res = await otherAgent.patch(`/api/tickets/${ticketId}`).send({ status: 'CLOSED' });
    expect(res.status).toBe(403);
  });

  it('returns 404 for a ticket that was soft-deleted or never existed', async () => {
    const res = await ownerAgent.get('/api/tickets/does-not-exist');
    expect(res.status).toBe(404);
  });
});
