import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, ShieldCheck } from 'lucide-react';
import { getCustomer } from '../../api/customers';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Seo } from '../../components/Seo';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/utils';
import { Textarea } from '../../components/ui/Textarea';
import { useToast } from '../../components/ui/Toast';

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!id) return;
    setNote(localStorage.getItem(`support-copilot.customer-note.${id}`) ?? '');
  }, [id]);

  function saveNote() {
    if (!id || !note.trim()) return;
    localStorage.setItem(`support-copilot.customer-note.${id}`, note.trim());
    setIsAddingNote(false);
    showToast({ variant: 'success', message: 'Private note saved on this device.' });
  }

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
            Review account details, ticket health, and AI insights for this customer.
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
                <p className="text-sm text-ink-500 dark:text-ink-400">Customer identity and account details.</p>
              </div>
            </CardHeader>
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Name" value={customer?.name ?? '—'} />
              <ProfileField label="Email" value={customer?.email ?? '—'} />
              <ProfileField label="Company" value={company} />
              <ProfileField label="Joined" value={customer ? formatDateTime(customer.createdAt) : '—'} />
            </CardBody>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatusCard label="Satisfaction" value="92%" relation="Last 30 days" />
            <StatusCard label="Avg. response" value="2.4h" relation="Across support" />
          </div>

          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Support health</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Signals that help you prioritize this customer.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid gap-3 rounded-[28px] border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
                  <MessageSquare className="h-4 w-4 text-accent-600" /> Recent ticket activity
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400">Last response was 2 hours ago. One high-priority issue remains open.</p>
              </div>
              <div className="grid gap-3 rounded-[28px] border border-ink-100 bg-white/90 p-4 dark:border-ink-800 dark:bg-ink-900/80">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-ink-100">
                  <ShieldCheck className="h-4 w-4 text-accent-600" /> Risk level
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400">High priority account. Recommended follow-up from senior support.</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Account summary</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Key customer metrics and service status.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <DetailRow label="Segment" value={customer?.company ? 'Enterprise' : 'Standard'} />
              <DetailRow label="Support plan" value="Premium" />
              <DetailRow label="Open tickets" value="2" />
              <DetailRow label="CSAT" value="92%" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-semibold">Recommended actions</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">Next best steps for this customer.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <ActionItem label="Follow up on open escalations" tone="warning" />
              <ActionItem label="Recommend knowledge base article" tone="accent" />
              <ActionItem label="Schedule account review" tone="success" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">Private notes</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Context only visible to support teammates.</p>
                </div>
                <Badge tone="accent">Draft</Badge>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {isAddingNote ? (
                <>
                  <Textarea
                    id="private-note"
                    label="Private note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add special instructions or escalation history…"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveNote} disabled={!note.trim()}>Save note</Button>
                    <Button size="sm" variant="secondary" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-3xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600 dark:border-ink-800 dark:bg-ink-950/50 dark:text-ink-400">
                    {note || 'Add notes to capture special instructions or escalation history for this customer.'}
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setIsAddingNote(true)}>
                    {note ? 'Edit note' : 'Add note'}
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-ink-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-ink-100">{value}</p>
    </div>
  );
}

function StatusCard({ label, value, relation }: { label: string; value: string; relation: string }) {
  return (
    <Card>
      <CardBody className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">{label}</p>
        <p className="text-3xl font-semibold text-ink-950 dark:text-ink-100">{value}</p>
        <p className="text-sm text-ink-500 dark:text-ink-400">{relation}</p>
      </CardBody>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-ink-100 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950/50">
      <span className="text-sm text-ink-500 dark:text-ink-400">{label}</span>
      <span className="text-sm font-semibold text-ink-950 dark:text-ink-100">{value}</span>
    </div>
  );
}

function ActionItem({ label, tone }: { label: string; tone: 'accent' | 'warning' | 'success' }) {
  return (
    <div className={`rounded-3xl border border-ink-100 p-4 text-sm dark:border-ink-800 dark:bg-ink-950/50 ${tone === 'warning' ? 'bg-warning-50/70 text-warning-700 dark:bg-warning-500/10 dark:text-warning-200' : tone === 'success' ? 'bg-success-50/70 text-success-700 dark:bg-success-500/10 dark:text-success-200' : 'bg-accent-50/70 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200'}`}>
      {label}
    </div>
  );
}
