import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listUsers, updateUserRole } from '../api/users';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import { initials } from '../lib/utils';
import type { Role } from '../types';

export function TeamPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: users, isPending, isError, refetch } = useQuery({ queryKey: ['users'], queryFn: listUsers });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => updateUserRole(id, role),
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Role updated' });
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  if (isError) return <ErrorState message="Could not load the team." onRetry={() => refetch()} />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Team</h1>
        <p className="text-sm text-ink-600 dark:text-ink-400">Manage agent roles and access.</p>
      </div>

      <Card>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-8 w-8 rounded-pill" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))
            : users?.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-accent-100 text-xs font-semibold text-accent-700 dark:bg-accent-500/20 dark:text-accent-400">
                      {initials(u.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-950 dark:text-ink-100">{u.name}</p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </div>
                    {!u.isEmailVerified && (
                      <span className="rounded-pill bg-warning-50 px-2 py-0.5 text-xs text-warning-600 dark:bg-warning-500/10">
                        Unverified
                      </span>
                    )}
                  </div>
                  <Select
                    id={`role-${u.id}`}
                    value={u.role}
                    disabled={u.id === currentUser?.id || roleMutation.isPending}
                    onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value as Role })}
                    className="w-32"
                  >
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </div>
              ))}
        </div>
      </Card>
    </div>
  );
}
