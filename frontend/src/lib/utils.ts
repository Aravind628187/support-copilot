import clsx, { ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDateTime(value: string | Date): string {
  return format(new Date(value), 'MMM d, yyyy \u2022 h:mm a');
}

export function formatRelative(value: string | Date): string {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
