import { Router } from 'express';
import { requireAuth, requireVerified } from '../../middleware/auth';
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

router.use(requireAuth());

router.get(
  '/',
  validate({ query: listArticlesQuerySchema }),
  asyncHandler(async (req, res) => {
    const { search, tag } = req.query as {
      search?: string;
      tag?: string;
    };

    const pageParams = parsePageParams(
      req.query as Record<string, unknown>
    );

    const articles = await service.listArticles(
      { search, tag },
      pageParams
    );

    res.json(articles);
  }),
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const article = await service.getArticle(id);

    res.json(article);
  }),
);

router.post(
  '/',
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

router.patch(
  '/:id',
  requireVerified(),
  validate({
    params: idParamSchema,
    body: updateArticleSchema,
  }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    const article = await service.updateArticle(
      id,
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

router.delete(
  '/:id',
  requireVerified(),
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const id = req.params.id!;

    await service.softDeleteArticle(id);

    await recordAudit({
      actorId: req.user!.id,
      action: 'kb.delete',
      entityType: 'KnowledgeBaseArticle',
      entityId: id,
    });

    res.status(204).send();
  }),
);

export default router;