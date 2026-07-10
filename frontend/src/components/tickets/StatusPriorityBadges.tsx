import { Circle, CircleDot, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { TicketPriority, TicketStatus } from '../../types';

const statusConfig: Record<TicketStatus, { label: string; tone: 'accent' | 'warning' | 'success' | 'neutral'; icon: typeof Circle }> = {
  OPEN: { label: 'Open', tone: 'accent', icon: CircleDot },
  PENDING: { label: 'Pending', tone: 'warning', icon: Circle },
  RESOLVED: { label: 'Resolved', tone: 'success', icon: CheckCircle2 },
  CLOSED: { label: 'Closed', tone: 'neutral', icon: XCircle },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge tone={config.tone}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

const priorityConfig: Record<TicketPriority, { label: string; tone: 'neutral' | 'accent' | 'warning' | 'danger' }> = {
  LOW: { label: 'Low', tone: 'neutral' },
  MEDIUM: { label: 'Medium', tone: 'accent' },
  HIGH: { label: 'High', tone: 'warning' },
  URGENT: { label: 'Urgent', tone: 'danger' },
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
