import { Router } from 'express';
import { requireAuth, requireVerified } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { parsePageParams } from '../../utils/pagination';
import { recordAudit } from '../audit/audit.service';
import {
  createArticleSchema,
  idParamSchema,
  listArticlesQuerySchema,
  updateArticleSchema,
} from './kb.schema';
import * as service from './kb.service';

const router = Router();

/**
 * All Knowledge Base routes require authentication.
 */
router.use(requireAuth());

/**
 * GET /api/kb
 * Any authenticated user can view/search articles.
 */
router.get(
  '/',
  validate({ query: listArticlesQuerySchema }),
  asyncHandler(async (req, res) => {
    const { search, tag } = req.query as {
      search?: string;
      tag?: string;
    };

    const pageParams = parsePageParams(
      req.query as Record<string, unknown>,
    );

    const articles = await service.listArticles(
      { search, tag },
      pageParams,
    );

    res.json(articles);
  }),
);

/**
 * GET /api/kb/:id
 * Any authenticated user can read an article.
 */
router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const article = await service.getArticle(req.params.id!);
    res.json(article);
  }),
);

/**
 * POST /api/kb
 * ADMIN only
 */
router.post(
  '/',
  requireRole('ADMIN'),
  requireVerified(),
  validate({ body: createArticleSchema }),
  asyncHandler(async (req, res) => {
    const article = await service.createArticle(
      req.user!.id,
      req.body,
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'kb.create',
      entityType: 'KnowledgeBaseArticle',
      entityId: article.id,
    });

    res.status(201).json(article);
  }),
);

/**
 * PATCH /api/kb/:id
 * ADMIN only
 */
router.patch(
  '/:id',
  requireRole('ADMIN'),
  requireVerified(),
  validate({
    params: idParamSchema,
    body: updateArticleSchema,
  }),
  asyncHandler(async (req, res) => {
    const article = await service.updateArticle(
      req.params.id!,
      req.body,
    );

    await recordAudit({
      actorId: req.user!.id,
      action: 'kb.update',
      entityType: 'KnowledgeBaseArticle',
      entityId: article.id,
      metadata: req.body,
    });

    res.json(article);
  }),
);

/**
 * DELETE /api/kb/:id
 * ADMIN only
 */
router.delete(
  '/:id',
  requireRole('ADMIN'),
  requireVerified(),
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    await service.softDeleteArticle(req.params.id!);

    await recordAudit({
      actorId: req.user!.id,
      action: 'kb.delete',
      entityType: 'KnowledgeBaseArticle',
      entityId: req.params.id!,
    });

    res.status(204).send();
  }),
);

export default router;