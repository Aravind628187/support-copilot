import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Sparkles, Send, Trash2 } from 'lucide-react';
import {
  getTicket,
  updateTicket,
  deleteTicket,
  sendMessage,
  generateDraftReply,
  sendOrEditMessage,
} from '../../api/tickets';
import { listUsers } from '../../api/users';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { ErrorState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge, PriorityBadge } from '../../components/tickets/StatusPriorityBadges';
import { MessageThread } from '../../components/tickets/MessageThread';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../api/client';
import { formatDateTime } from '../../lib/utils';
import type { TicketStatus, TicketPriority } from '../../types';
import axios from 'axios';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [replyBody, setReplyBody] = useState('');

  const {
    data: ticket,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ['ticket', id], queryFn: () => getTicket(id!), enabled: !!id });

  const { data: agents } = useQuery({ queryKey: ['users'], queryFn: listUsers });

  const canModify = !!ticket && !!user && (user.role === 'ADMIN' || !ticket.assigneeId || ticket.assigneeId === user.id);

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    void queryClient.invalidateQueries({ queryKey: ['tickets'] });
  }

  const updateMutation = useMutation({
    mutationFn: (patch: Parameters<typeof updateTicket>[1]) => updateTicket(id!, patch),
    onSuccess: () => {
      invalidate();
      showToast({ variant: 'success', message: 'Ticket updated' });
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTicket(id!),
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Ticket deleted' });
      navigate('/tickets');
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (body: string) => sendMessage(id!, body),
    onSuccess: () => {
      setReplyBody('');
      invalidate();
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  const draftMutation = useMutation({
    mutationFn: () => generateDraftReply(id!),
    onSuccess: ({ groundedOn }) => {
      invalidate();
      showToast({
        variant: 'success',
        message:
          groundedOn.length > 0
            ? `Draft ready — grounded on: ${groundedOn.join(', ')}`
            : 'Draft ready — no matching KB articles were found, review carefully',
      });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 503) {
        showToast({
          variant: 'error',
          message: 'AI service is not configured.',
        });
        return;
      }
      showToast({ variant: 'error', message: extractErrorMessage(err, 'Could not generate a draft') });
    },
  });

  const sendDraftMutation = useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: string }) =>
      sendOrEditMessage(id!, messageId, body),
    onSuccess: () => {
      invalidate();
      showToast({ variant: 'success', message: 'Reply sent' });
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  if (isError) {
    return <ErrorState message="Could not load this ticket." onRetry={() => refetch()} />;
  }

  if (isPending || !ticket) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/tickets')}
        className="flex w-fit items-center gap-1.5 text-sm text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tickets
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex-col items-start gap-2 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-lg font-semibold">{ticket.subject}</h1>
                <p className="font-mono text-xs text-ink-400">
                  #{ticket.id.slice(-8)} · opened {formatDateTime(ticket.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </CardHeader>
            <CardBody>
              <p className="whitespace-pre-wrap text-sm text-ink-800 dark:text-ink-100">
                {ticket.description}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Conversation</h2>
              <Button
                size="sm"
                variant="secondary"
                isLoading={draftMutation.isPending}
                disabled={!canModify}
                onClick={() => draftMutation.mutate()}
              >
                <Sparkles className="h-4 w-4 text-ai-500" />
                Draft with AI
              </Button>
            </CardHeader>
            <CardBody>
              <MessageThread
                messages={ticket.messages ?? []}
                isSending={sendDraftMutation.isPending}
                onSendDraft={(messageId, body) => sendDraftMutation.mutate({ messageId, body })}
              />

              <div className="mt-4 flex flex-col gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
                <Textarea
                  id="reply"
                  aria-label="Reply"
                  placeholder={canModify ? 'Write a reply…' : 'Only the assigned agent or an admin can reply'}
                  value={replyBody}
                  disabled={!canModify}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={!canModify || !replyBody.trim()}
                    isLoading={sendMessageMutation.isPending}
                    onClick={() => sendMessageMutation.mutate(replyBody)}
                  >
                    <Send className="h-4 w-4" />
                    Send reply
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Details</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <Select
                id="status"
                label="Status"
                value={ticket.status}
                disabled={!canModify}
                onChange={(e) => updateMutation.mutate({ status: e.target.value as TicketStatus })}
              >
                <option value="OPEN">Open</option>
                <option value="PENDING">Pending</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </Select>

              <Select
                id="priority"
                label="Priority"
                value={ticket.priority}
                disabled={!canModify}
                onChange={(e) => updateMutation.mutate({ priority: e.target.value as TicketPriority })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Select>

              <Select
                id="assignee"
                label="Assignee"
                value={ticket.assigneeId ?? ''}
                disabled={!canModify}
                onChange={(e) => updateMutation.mutate({ assigneeId: e.target.value || null })}
              >
                <option value="">Unassigned</option>
                {agents?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>

              {!canModify && (
                <p className="text-xs text-ink-400">
                  Assigned to another agent — only they or an admin can make changes.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Customer</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-1 text-sm">
              <p className="font-medium text-ink-950 dark:text-ink-100">{ticket.customer.name}</p>
              <p className="text-ink-600 dark:text-ink-400">{ticket.customer.email}</p>
              {ticket.customer.company && (
                <p className="text-ink-400">{ticket.customer.company}</p>
              )}
            </CardBody>
          </Card>

          {user?.role === 'ADMIN' && (
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => {
                if (confirm('Delete this ticket? This cannot be undone.')) deleteMutation.mutate();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete ticket
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
