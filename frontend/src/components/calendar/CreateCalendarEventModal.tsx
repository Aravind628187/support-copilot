import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export interface CalendarEventInput {
  title: string;
  date: string;
  time: string;
  description: string;
}

interface CreateCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: CalendarEventInput) => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateCalendarEventModal({ isOpen, onClose, onCreate }: CreateCalendarEventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalendarEventInput>({
    defaultValues: { title: '', date: today(), time: '09:00', description: '' },
  });

  useEffect(() => {
    if (isOpen) reset({ title: '', date: today(), time: '09:00', description: '' });
  }, [isOpen, reset]);

  function submit(values: CalendarEventInput) {
    onCreate(values);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create calendar event">
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit(submit)}>
        <Input
          id="calendar-event-title"
          label="Event title"
          placeholder="Customer follow-up"
          error={errors.title?.message}
          {...register('title', { required: 'Enter an event title', maxLength: { value: 120, message: 'Use 120 characters or fewer' } })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="calendar-event-date"
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date', { required: 'Choose an event date' })}
          />
          <Input
            id="calendar-event-time"
            label="Time"
            type="time"
            error={errors.time?.message}
            {...register('time', { required: 'Choose an event time' })}
          />
        </div>
        <Textarea
          id="calendar-event-description"
          label="Notes"
          placeholder="Optional context, attendees, or follow-up details"
          {...register('description', { maxLength: { value: 1000, message: 'Use 1,000 characters or fewer' } })}
          error={errors.description?.message}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create event</Button>
        </div>
      </form>
    </Modal>
  );
}
