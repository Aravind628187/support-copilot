import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo1234!';

async function main() {
  console.log('🌱 Seeding SupportCopilot...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'demo@demo.com',
      passwordHash,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@demo.com' },
    update: {},
    create: {
      name: 'Sam Agent',
      email: 'agent@demo.com',
      passwordHash,
      role: 'AGENT',
      isEmailVerified: true,
    },
  });

  const [priya, diego, grace, tomas] = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'priya@northwind.io' },
      update: {},
      create: { name: 'Priya Sharma', email: 'priya@northwind.io', company: 'Northwind Retail' },
    }),
    prisma.customer.upsert({
      where: { email: 'diego@lumen-labs.com' },
      update: {},
      create: { name: 'Diego Alvarez', email: 'diego@lumen-labs.com', company: 'Lumen Labs' },
    }),
    prisma.customer.upsert({
      where: { email: 'grace@fernbrook.co' },
      update: {},
      create: { name: 'Grace Chen', email: 'grace@fernbrook.co', company: 'Fernbrook & Co' },
    }),
    prisma.customer.upsert({
      where: { email: 'tomas@atlascloud.dev' },
      update: {},
      create: { name: 'Tomás Silva', email: 'tomas@atlascloud.dev', company: 'AtlasCloud' },
    }),
  ]);

  const [kbReset, kbBilling, kbExport] = await Promise.all([
    prisma.knowledgeBaseArticle.create({
      data: {
        title: 'How to reset your password',
        content:
          'Go to Settings > Security > Reset Password. A reset link is valid for 30 minutes and can only be used once. If the link expires, request a new one from the login screen — do not reuse an expired link.',
        tags: ['account', 'password', 'security'],
        authorId: admin.id,
      },
    }),
    prisma.knowledgeBaseArticle.create({
      data: {
        title: 'Billing cycle and invoice timing',
        content:
          'Invoices are generated on the 1st of each month and are due within 14 days. Annual plans are billed once at signup and on each renewal anniversary. Refunds for annual plans are prorated only within the first 30 days.',
        tags: ['billing', 'invoice', 'refund'],
        authorId: admin.id,
      },
    }),
    prisma.knowledgeBaseArticle.create({
      data: {
        title: 'Exporting your data as CSV',
        content:
          'Any table view has an Export CSV button in the top-right toolbar. Exports respect your current filters and are capped at 5,000 rows per file — for larger datasets, narrow the filter and export in batches.',
        tags: ['export', 'csv', 'data'],
        authorId: agent.id,
      },
    }),
  ]);

  const ticketSeeds = [
    {
      subject: "Can't log in after resetting my password",
      description:
        'I requested a password reset an hour ago and clicked the link, but it says the link is invalid now.',
      priority: 'HIGH' as const,
      status: 'OPEN' as const,
      customerId: priya.id,
      assigneeId: agent.id,
      firstMessage: 'Hi, I reset my password an hour ago and the confirmation link now says invalid. Can you help?',
    },
    {
      subject: 'Question about this month\'s invoice amount',
      description: 'The invoice total looks higher than last month and I want to understand why.',
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      customerId: diego.id,
      assigneeId: agent.id,
      firstMessage: "Hey team, this month's invoice is $40 more than usual — did something change on my plan?",
    },
    {
      subject: 'CSV export is missing rows',
      description: 'Exported the tickets table and it looks like some rows are missing compared to the UI.',
      priority: 'URGENT' as const,
      status: 'OPEN' as const,
      customerId: grace.id,
      assigneeId: null,
      firstMessage: 'The CSV I exported this morning has fewer rows than what I can see on screen. Is there a cap?',
    },
    {
      subject: 'Feature request: dark mode schedule',
      description: 'Would like dark mode to switch automatically based on system time.',
      priority: 'LOW' as const,
      status: 'RESOLVED' as const,
      customerId: tomas.id,
      assigneeId: admin.id,
      firstMessage: 'Small suggestion — could dark mode follow my OS setting automatically?',
    },
    {
      subject: 'Onboarding checklist stuck at 80%',
      description: 'The onboarding progress bar has been stuck for two days even after completing all steps.',
      priority: 'MEDIUM' as const,
      status: 'CLOSED' as const,
      customerId: priya.id,
      assigneeId: agent.id,
      firstMessage: 'My onboarding checklist says 80% even though I finished every step listed.',
    },
  ];

  for (const seed of ticketSeeds) {
    const ticket = await prisma.ticket.create({
      data: {
        subject: seed.subject,
        description: seed.description,
        priority: seed.priority,
        status: seed.status,
        customerId: seed.customerId,
        assigneeId: seed.assigneeId,
        resolvedAt: seed.status === 'RESOLVED' || seed.status === 'CLOSED' ? new Date() : null,
      },
    });

    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        authorType: 'CUSTOMER',
        body: seed.firstMessage,
      },
    });
  }

  console.log('✅ Seed complete.');
  console.log('   Demo admin login:  demo@demo.com  /  Demo1234!');
  console.log('   Demo agent login:  agent@demo.com /  Demo1234!');
  console.log(`   Knowledge base articles: ${[kbReset, kbBilling, kbExport].length}`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
