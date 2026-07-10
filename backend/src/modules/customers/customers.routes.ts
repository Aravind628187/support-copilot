import { Router } from 'express';
import { requireAuth, requireVerified } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { parsePageParams } from '../../utils/pagination';
import { recordAudit } from '../audit/audit.service';
import {
  createCustomerSchema,
  idParamSchema,
  listCustomersQuerySchema,
  updateCustomerSchema,
} from './customers.schema';
import * as service from './customers.service';

const router = Router();

router.use(requireAuth());

router.get(
  '/',
  validate({ query: listCustomersQuerySchema }),
  asyncHandler(async (req, res) => {
    const { search } = req.query as { search?: string };
    const pageParams = parsePageParams(req.query as Record<string, unknown>);

    const customers = await service.listCustomers(search, pageParams);

    res.json(customers);
  }),
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const customer = await service.getCustomer(id);

    res.json(customer);
  }),
);

router.post(
  '/',
  requireVerified(),
  validate({ body: createCustomerSchema }),
  asyncHandler(async (req, res) => {
    const customer = await service.createCustomer(req.body);

    await recordAudit({
      actorId: req.user!.id,
      action: 'customer.create',
      entityType: 'Customer',
      entityId: customer.id,
    });

    res.status(201).json(customer);
  }),
);

router.patch(
  '/:id',
  requireVerified(),
  validate({
    params: idParamSchema,
    body: updateCustomerSchema,
  }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const customer = await service.updateCustomer(id, req.body);

    await recordAudit({
      actorId: req.user!.id,
      action: 'customer.update',
      entityType: 'Customer',
      entityId: customer.id,
      metadata: req.body,
    });

    res.json(customer);
  }),
);

export default router;