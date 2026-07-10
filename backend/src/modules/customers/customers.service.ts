import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { parsePageParams, buildPagedResult, PageParams } from '../../utils/pagination';

export async function listCustomers(search: string | undefined, pageParams: PageParams) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pageParams.skip,
      take: pageParams.take,
    }),
    prisma.customer.count({ where }),
  ]);

  return buildPagedResult(items, total, pageParams);
}

export async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
}

export async function createCustomer(data: { name: string; email: string; company?: string }) {
  const existing = await prisma.customer.findUnique({ where: { email: data.email } });
  if (existing) throw ApiError.conflict('A customer with that email already exists');
  return prisma.customer.create({ data });
}

export async function updateCustomer(
  id: string,
  data: Partial<{ name: string; email: string; company: string }>,
) {
  await getCustomer(id);
  return prisma.customer.update({ where: { id }, data });
}

export { parsePageParams };
