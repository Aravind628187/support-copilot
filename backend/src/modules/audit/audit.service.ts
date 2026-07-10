import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export async function recordAudit(params: {
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? Prisma.JsonNull,
    },
  });
}