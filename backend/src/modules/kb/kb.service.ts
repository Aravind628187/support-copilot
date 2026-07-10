import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { buildPagedResult, PageParams } from '../../utils/pagination';

export async function listArticles(
  filters: { search?: string; tag?: string },
  pageParams: PageParams,
) {
  const where = {
    deletedAt: null,
    ...(filters.tag ? { tags: { has: filters.tag } } : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' as const } },
            { content: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.knowledgeBaseArticle.findMany({
      where,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: pageParams.skip,
      take: pageParams.take,
    }),
    prisma.knowledgeBaseArticle.count({ where }),
  ]);

  return buildPagedResult(items, total, pageParams);
}

export async function getArticle(id: string) {
  const article = await prisma.knowledgeBaseArticle.findFirst({ where: { id, deletedAt: null } });
  if (!article) throw ApiError.notFound('Article not found');
  return article;
}

export async function createArticle(authorId: string, data: { title: string; content: string; tags: string[] }) {
  return prisma.knowledgeBaseArticle.create({ data: { ...data, authorId } });
}

export async function updateArticle(
  id: string,
  data: Partial<{ title: string; content: string; tags: string[] }>,
) {
  await getArticle(id);
  return prisma.knowledgeBaseArticle.update({ where: { id }, data });
}

export async function softDeleteArticle(id: string) {
  await getArticle(id);
  await prisma.knowledgeBaseArticle.update({ where: { id }, data: { deletedAt: new Date() } });
}

/**
 * Keyword-based retrieval for AI grounding: naive but transparent — every
 * word in the ticket subject over 3 characters becomes an OR'd ILIKE term,
 * ranked by how many terms matched. This is the honest, explainable version
 * of retrieval; swapping in embeddings + a vector index (pgvector) is the
 * natural upgrade path once the KB grows past a few hundred articles.
 */
export async function findRelevantArticles(queryText: string, limit = 3) {
  const terms = Array.from(
    new Set(
      queryText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3),
    ),
  ).slice(0, 12);

  if (terms.length === 0) return [];

  const candidates = await prisma.knowledgeBaseArticle.findMany({
    where: {
      deletedAt: null,
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' as const } },
        { content: { contains: term, mode: 'insensitive' as const } },
        { tags: { has: term } },
      ]),
    },
    take: 50,
  });

  const scored = candidates.map((article) => {
    const haystack = `${article.title} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
    const score = terms.reduce((acc, term) => acc + (haystack.includes(term) ? 1 : 0), 0);
    return { article, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}
