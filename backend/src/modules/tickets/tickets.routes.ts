import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireVerified } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { generalWriteLimiter } from '../../middleware/rateLimit';
import { asyncHandler } from '../../utils/asyncHandler';
import { parsePageParams } from '../../utils/pagination';
import { recordAudit } from '../audit/audit.service';
import {
  bulkCloseSchema,
  createTicketSchema,
  idParamSchema,
  listTicketsQuerySchema,
  updateTicketSchema,
} from './tickets.schema';
import * as service from './tickets.service';

type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;

const router = Router();

router.use(requireAuth());

router.get(
  '/',
  validate({ query: listTicketsQuerySchema }),
  asyncHandler(async (req, res) => {
    const {
      search,
      status,
      priority,
      assigneeId,
      sort,
      order,
    } = req.query as unknown as ListTicketsQuery;

    const pageParams = parsePageParams(
      req.query as Record<string, unknown>,
    );

    const tickets = await service.listTickets(
      {
        id: req.user!.id,
        role: req.user!.role,
      },
      {
        search,
        status,
        priority,
        assigneeId,
        sort,
        order,
      },
      pageParams,
    );

    res.json(tickets);
  }),
);

router.get(
  '/export.csv',
  validate({ query: listTicketsQuerySchema }),
  asyncHandler(async (req, res) => {
    const {
      search,
      status,
      priority,
      assigneeId,
      sort,
      order,
    } = req.query as unknown as ListTicketsQuery;

    const csv = await service.exportTicketsCsv({
      search,
      status,
      priority,
      assigneeId,
      sort,
      order,
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="tickets-${Date.now()}.csv"`
    );

    res.send(csv);
  })
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const ticket = await service.getTicket(id, {
     id: req.user!.id,
     role: req.user!.role,
   });

    res.json(ticket);
  })
);

router.post(
  '/',
  requireVerified(),
  generalWriteLimiter,
  validate({ body: createTicketSchema }),
  asyncHandler(async (req, res) => {
    const ticket = await service.createTicket(req.user!, req.body);

    await recordAudit({
      actorId: req.user!.id,
      action: 'ticket.create',
      entityType: 'Ticket',
      entityId: ticket.id,
    });

    res.status(201).json(ticket);
  })
);

router.patch(
  '/:id',
  requireVerified(),
  validate({
    params: idParamSchema,
    body: updateTicketSchema,
  }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const ticket = await service.updateTicket(
      id,
      req.user!,
      req.body
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'ticket.update',
      entityType: 'Ticket',
      entityId: ticket.id,
      metadata: req.body,
    });

    res.json(ticket);
  })
);

router.delete(
  '/:id',
  requireRole('ADMIN'),
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    await service.softDeleteTicket(id);

    await recordAudit({
      actorId: req.user!.id,
      action: 'ticket.delete',
      entityType: 'Ticket',
      entityId: id,
    });

    res.status(204).send();
  })
);

router.post(
  '/bulk-close',
  requireVerified(),
  validate({ body: bulkCloseSchema }),
  asyncHandler(async (req, res) => {
    const result = await service.bulkClose(
      req.body.ids,
      req.user!
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'ticket.bulk_close',
      entityType: 'Ticket',
      entityId: 'bulk',
      metadata: {
        ids: req.body.ids,
        ...result,
      },
    });

    res.json(result);
  })
);

export default router;