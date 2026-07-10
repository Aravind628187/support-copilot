import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Download, X } from 'lucide-react';
import { listTickets, bulkCloseTickets, ticketsExportCsvUrl, TicketListParams } from '../../api/tickets';
import { listCustomers } from '../../api/customers';
import { listUsers } from '../../api/users';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { TicketRowSkeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState, NoResultsState } from '../../components/ui/EmptyState';
import { StatusBadge, PriorityBadge } from '../../components/tickets/StatusPriorityBadges';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../components/ui/Toast';
import { formatRelative } from '../../lib/utils';
import { NewTicketModal } from '../../components/tickets/NewTicketModal';
import type { TicketPriority, TicketStatus } from '../../types';

export function TicketsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(searchParams.get('new') === '1');

  const filters: TicketListParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: (searchParams.get('status') as TicketStatus) || undefined,
      priority: (searchParams.get('priority') as TicketPriority) || undefined,
      assigneeId: searchParams.get('assigneeId') || undefined,
      sort: (searchParams.get('sort') as TicketListParams['sort']) || 'createdAt',
      order: (searchParams.get('order') as TicketListParams['order']) || 'desc',
      page: Number(searchParams.get('page') ?? '1'),
      pageSize: 25,
    }),
    [debouncedSearch, searchParams],
  );

  // Keep the URL in sync with the debounced search term so state is
  // shareable and the back button works, per the handbook's spec.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set('search', debouncedSearch);
    else next.delete('search');
    next.delete('new');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => listTickets(filters),
  });

  const { data: agents } = useQuery({ queryKey: ['users'], queryFn: listUsers });
  const { data: customerOptions } = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: () => listCustomers({}),
  });

  const bulkClose = useMutation({
    mutationFn: bulkCloseTickets,
    onSuccess: (result) => {
      showToast({
        variant: result.closedCount > 0 ? 'success' : 'info',
        message:
          result.skippedCount > 0
            ? `Closed ${result.closedCount} tickets — ${result.skippedCount} skipped (not yours)`
            : `Closed ${result.closedCount} tickets`,
      });
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: () => showToast({ variant: 'error', message: 'Could not close the selected tickets' }),
  });

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  const hasFilters = !!(filters.search || filters.status || filters.priority || filters.assigneeId);
  const allOnPageSelected = !!data && data.items.length > 0 && data.items.every((t) => selected.has(t.id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tickets</h1>
          <p className="text-sm text-ink-600 dark:text-ink-400">Triage, assign, and resolve.</p>
        </div>
        <div className="flex gap-2">
          <a href={ticketsExportCsvUrl(filters)} download>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </a>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New ticket
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 dark:border-ink-800 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              id="search"
              label="Search"
              placeholder="Subject, description, or customer…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select
            id="status"
            label="Status"
            value={searchParams.get('status') ?? ''}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </Select>
          <Select
            id="priority"
            label="Priority"
            value={searchParams.get('priority') ?? ''}
            onChange={(e) => updateFilter('priority', e.target.value)}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>
          <Select
            id="assignee"
            label="Assignee"
            value={searchParams.get('assigneeId') ?? ''}
            onChange={(e) => updateFilter('assigneeId', e.target.value)}
          >
            <option value="">Everyone</option>
            {agents?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between bg-accent-50 px-4 py-2 text-sm dark:bg-accent-500/10">
            <span className="text-accent-700 dark:text-accent-400">{selected.size} selected</span>
            <Button
              size="sm"
              variant="secondary"
              isLoading={bulkClose.isPending}
              onClick={() => {
                if (confirm(`Close ${selected.size} ticket(s)? This cannot be undone from here.`)) {
                  bulkClose.mutate(Array.from(selected));
                }
              }}
            >
              Close selected
            </Button>
          </div>
        )}

        {isError ? (
          <ErrorState message="Could not load tickets." onRetry={() => refetch()} />
        ) : isPending ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <TicketRowSkeleton key={i} />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          hasFilters ? (
            <NoResultsState onReset={clearFilters} />
          ) : (
            <EmptyState
              title="No tickets yet"
              description="Create your first ticket to start triaging your queue."
              actionLabel="Create your first ticket"
              onAction={() => setCreateOpen(true)}
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                <tr>
                  <th className="w-10 px-4 py-2">
                    <input
                      type="checkbox"
                      aria-label="Select all tickets on this page"
                      checked={allOnPageSelected}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) data.items.forEach((t) => next.add(t.id));
                        else data.items.forEach((t) => next.delete(t.id));
                        setSelected(next);
                      }}
                    />
                  </th>
                  <th className="px-2 py-2">Subject</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Priority</th>
                  <th className="px-2 py-2">Assignee</th>
                  <th className="px-4 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer border-b border-ink-50 hover:bg-ink-50 dark:border-ink-800/60 dark:hover:bg-ink-800/40"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${ticket.subject}`}
                        checked={selected.has(ticket.id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(ticket.id);
                          else next.delete(ticket.id);
                          setSelected(next);
                        }}
                      />
                    </td>
                    <td className="max-w-xs px-2 py-3" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      <p className="truncate font-medium text-ink-950 dark:text-ink-100">
                        {ticket.subject}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-ink-600 dark:text-ink-400" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      {ticket.customer.name}
                    </td>
                    <td className="px-2 py-3" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-2 py-3" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-2 py-3 text-ink-600 dark:text-ink-400" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      {ticket.assignee?.name ?? 'Unassigned'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-400" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                      {formatRelative(ticket.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.items.length > 0 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={(page) => updateFilter('page', String(page))}
          />
        )}
      </Card>

      <NewTicketModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        customers={customerOptions?.items ?? []}
        onCreated={() => {
          setCreateOpen(false);
          void queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }}
      />
    </div>
  );
}
