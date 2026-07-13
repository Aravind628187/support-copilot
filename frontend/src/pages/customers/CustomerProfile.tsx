import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, MessageSquare } from 'lucide-react';
import { getCustomer } from '../../api/customers';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Seo } from '../../components/Seo';
import { formatDateTime } from '../../lib/utils';

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isError, refetch } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id!),
    enabled: !!id,
  });

  const company = useMemo(() => customer?.company ?? 'Independent', [customer?.company]);

  if (isError) {
    return (
      <div className="space-y-4">
        <Seo title="Customer" description="Customer profile details." />
        <p className="text-sm text-danger-500">Could not load customer profile.</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Customer Profile" description="Customer profile, ticket history, and activity." />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-500">Customer profile</p>
          <h1 className="text-3xl font-semibold">{customer?.name ?? 'Customer'}</h1>
          <p className="max-w-2xl text-sm text-ink-500 dark:text-ink-400">
            Review customer history, satisfaction metrics, and support account details.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Profile overview</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Customer identity and workspace information.</p>
              </div>
            </CardHeader>
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Name</p>
                <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-ink-100">{customer?.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Email</p>
                <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-ink-100">{customer?.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Company</p>
                <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-ink-100">{company}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Joined</p>
                <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
                  {customer ? formatDateTime(customer.createdAt) : '—'}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Activity summary</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Customer satisfaction, recent actions, and ticket health.</p>
              </div>
            </CardHeader>
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Satisfaction</p>
                <p className="mt-2 text-3xl font-semibold text-ink-950 dark:text-ink-100">92%</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">Last 30 days</p>
              </div>
              <div className="rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Response time</p>
                <p className="mt-2 text-3xl font-semibold text-ink-950 dark:text-ink-100">2.4h</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">Average across support</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Support signals</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Actionable notes and relevant knowledge suggestions.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid gap-3">
                <div className="rounded-3xl border border-ink-100 bg-white/90 p-4 dark:border-ink-800 dark:bg-ink-900/80">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
                    <MessageSquare className="h-4 w-4 text-accent-600" /> Recent ticket activity
                  </div>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Customer last messaged 2 hours ago via email.</p>
                </div>
                <div className="rounded-3xl border border-ink-100 bg-white/90 p-4 dark:border-ink-800 dark:bg-ink-900/80">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
                    <FileText className="h-4 w-4 text-accent-600" /> Knowledge suggestions
                  </div>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">AI recommends 3 help articles relevant to this customer's current issue.</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Internal notes</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Keep private context and escalation guidance here.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
                <p className="text-sm text-ink-600 dark:text-ink-400">No notes yet. Add private notes to keep teammates aligned.</p>
              </div>
              <Button size="sm" variant="secondary">Add note</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
