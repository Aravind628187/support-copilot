import { useEffect, useState } from 'react';
import { CalendarCheck, Clock3 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreateCalendarEventModal, type CalendarEventInput } from '../components/calendar/CreateCalendarEventModal';
import { useToast } from '../components/ui/Toast';

interface CalendarEvent extends CalendarEventInput {
  id: string;
}

const calendarEventsStorageKey = 'support-copilot.calendar-events';

function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(calendarEventsStorageKey);
    return stored ? JSON.parse(stored) as CalendarEvent[] : [];
  } catch {
    return [];
  }
}

export function CalendarPage() {
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);

  useEffect(() => {
    localStorage.setItem(calendarEventsStorageKey, JSON.stringify(events));
  }, [events]);

  function createEvent(input: CalendarEventInput) {
    setEvents((current) => [...current, { ...input, id: crypto.randomUUID() }].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    ));
    showToast({ variant: 'success', message: 'Calendar event created' });
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Calendar" description="Manage your support schedule and agent availability." />

      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-accent-600 via-indigo-600 to-violet-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(54,84,209,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-100">Calendar</p>
            <h1 className="text-3xl font-semibold">Schedule and availability</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Plan agent shifts, SLA reminders, and customer follow-ups from one centralized calendar.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setCreateOpen(true)}>Create event</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Upcoming events</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {events.length > 0 ? (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                    <p className="font-medium text-ink-900 dark:text-ink-100">{event.title}</p>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{event.date} at {event.time}</p>
                    {event.description && <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{event.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-500 dark:text-ink-400">Create an event to track follow-ups, shifts, and support checkpoints.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">SLA reminders</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Keep critical response windows visible and aligned with service goals.
            </p>
          </CardBody>
        </Card>
      </div>

      <CreateCalendarEventModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={createEvent} />
    </div>
  );
}
