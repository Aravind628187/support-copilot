import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { customersExportCsvUrl, listCustomers } from '../../api/customers';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState, ErrorState, NoResultsState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { Seo } from '../../components/Seo';
import { formatDateTime } from '../../lib/utils';

export function CustomersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['customers', search, page],
    queryFn: () => listCustomers({ search: search || undefined, page }),
  });

  const customers = useMemo(() => data?.items ?? [], [data?.items]);
  const filtered = useMemo(
    () =>
      customers.filter((customer) =>
        [customer.name, customer.email, customer.company ?? '']
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [customers, search],
  );

  const summary = useMemo(
    () => ({
      total: data?.total ?? 0,
      satisfaction: 92,
      openTickets: 34,
      enterpriseAccounts: customers.filter((customer) => customer.company).length,
    }),
    [data?.total, customers],
  );

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Customers" description="Browse support customers and review their profiles." />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-500">Customers</p>
          <h1 className="text-3xl font-semibold">Customer directory</h1>
          <p className="max-w-2xl text-sm text-ink-500 dark:text-ink-400">
            Search customers, inspect account details, and review support history across your enterprise.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <a href={customersExportCsvUrl(search || undefined)} download>
            <Button size="sm" variant="secondary">
              <Download className="h-4 w-4" /> Export
            </Button>
          </a>
          <Button size="sm" onClick={() => navigate('/customers/new')}>
            <Plus className="h-4 w-4" /> Add customer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={<Users className="h-5 w-5" />} label="Total customers" value={summary.total} />
        <SummaryCard icon={<Sparkles className="h-5 w-5" />} label="Avg satisfaction" value="92%" />
        <SummaryCard icon={<ShieldCheck className="h-5 w-5" />} label="Open tickets" value={summary.openTickets} />
        <SummaryCard icon={<Users className="h-5 w-5" />} label="Enterprise accounts" value={summary.enterpriseAccounts} />
      </div>

      <Card>
        <div className="grid gap-4 p-4 sm:grid-cols-[1fr_240px]">
          <Input
            id="customer-search"
            label="Search customers"
            placeholder="Name, email, or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={<Search className="h-4 w-4 text-ink-400" />}
          />
        </div>
      </Card>

      <Card>
        {isError ? (
          <ErrorState message="Could not load customers." onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 rounded-3xl bg-ink-100 dark:bg-ink-800" />
            ))}
          </div>
        ) : !data || data.total === 0 ? (
          <EmptyState
            title="No customers yet"
            description="Invite your first customer to the platform and start tracking conversations."
            actionLabel="Refresh"
            onAction={() => refetch()}
          />
        ) : filtered.length === 0 ? (
          <NoResultsState onReset={() => setSearch('')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-100 text-xs uppercase tracking-[0.24em] text-ink-400 dark:border-ink-800">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer border-b border-ink-100 transition hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-900/60"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-ink-950 dark:text-ink-100">{customer.name}</div>
                      <div className="text-xs text-ink-500 dark:text-ink-400">{customer.email}</div>
                    </td>
                    <td className="px-4 py-4 text-ink-600 dark:text-ink-400">
                      {customer.company ?? 'Independent'}
                    </td>
                    <td className="px-4 py-4 text-ink-600 dark:text-ink-400">{customer.email}</td>
                    <td className="px-4 py-4 text-ink-500 dark:text-ink-400">
                      {formatDateTime(customer.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > 0 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </Card>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <div className="space-y-3 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-accent-50 text-accent-700">{icon}</div>
        <p className="text-xs uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">{label}</p>
        <p className="text-3xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
      </div>
    </Card>
  );
}
