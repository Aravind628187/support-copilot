import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAuditLog } from '../api/audit';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Pagination } from '../components/ui/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { formatDateTime } from '../lib/utils';

const ENTITY_TYPES = ['Ticket', 'TicketMessage', 'KnowledgeBaseArticle', 'Customer', 'User'];

export function AuditLogPage() {
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['audit', entityType, page],
    queryFn: () => listAuditLog({ entityType: entityType || undefined, page }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <p className="text-sm text-ink-600 dark:text-ink-400">Who changed what, and when.</p>
      </div>

      <div className="max-w-xs">
        <Select
          id="entity-type"
          label="Entity"
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All entities</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        {isError ? (
          <ErrorState message="Could not load the audit log." onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-5 w-full" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No activity recorded yet" />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                <tr>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-2 py-2">Entity</th>
                  <th className="px-2 py-2">Actor</th>
                  <th className="px-4 py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((entry) => (
                  <tr key={entry.id} className="border-b border-ink-50 dark:border-ink-800/60">
                    <td className="px-4 py-2 font-mono text-xs">{entry.action}</td>
                    <td className="px-2 py-2 text-ink-600 dark:text-ink-400">
                      {entry.entityType}
                      <span className="ml-1 font-mono text-[11px] text-ink-400">
                        #{entry.entityId.slice(-8)}
                      </span>
                    </td>
                    <td className="px-2 py-2">{entry.actor?.name ?? 'System'}</td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-ink-400">
                      {formatDateTime(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
