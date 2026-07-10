import { describe, expect, it } from 'vitest';
import { parsePageParams, buildPagedResult } from '../../src/utils/pagination';

describe('parsePageParams', () => {
  it('defaults to page 1 and pageSize 25 when nothing is provided (happy path)', () => {
    const params = parsePageParams({});
    expect(params).toEqual({ page: 1, pageSize: 25, skip: 0, take: 25 });
  });

  it('computes skip/take correctly for a later page', () => {
    const params = parsePageParams({ page: '3', pageSize: '10' });
    expect(params).toEqual({ page: 3, pageSize: 10, skip: 20, take: 10 });
  });

  it('hard-caps pageSize at 100 even if a larger value is requested (boundary case)', () => {
    const params = parsePageParams({ pageSize: '5000' });
    expect(params.pageSize).toBe(100);
  });

  it('falls back to page 1 for a non-numeric or negative page (failure mode)', () => {
    expect(parsePageParams({ page: 'abc' }).page).toBe(1);
    expect(parsePageParams({ page: '-5' }).page).toBe(1);
  });
});

describe('buildPagedResult', () => {
  it('computes totalPages from total and pageSize', () => {
    const result = buildPagedResult([1, 2, 3], 47, { page: 1, pageSize: 25, skip: 0, take: 25 });
    expect(result.totalPages).toBe(2);
  });
});
