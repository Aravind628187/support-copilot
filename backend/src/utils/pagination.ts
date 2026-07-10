export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

/**
 * We use offset pagination (page/pageSize) rather than keyset/cursor
 * pagination. That's a deliberate simplification for a dataset this size —
 * see docs/architecture.md for the trade-off and the upgrade path once a
 * table crosses ~10k rows.
 */
export function parsePageParams(query: Record<string, unknown>): PageParams {
  const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1);
  const requestedSize = Number.parseInt(String(query.pageSize ?? DEFAULT_PAGE_SIZE), 10);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.isNaN(requestedSize) ? DEFAULT_PAGE_SIZE : requestedSize),
  );

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function buildPagedResult<T>(
  items: T[],
  total: number,
  { page, pageSize }: PageParams,
): PagedResult<T> {
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
