import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { createTicket } from '../../api/tickets';
import { createCustomer } from '../../api/customers';
import { ticketFormSchema, TicketFormValues, customerFormSchema, CustomerFormValues } from '../../lib/validation';
import { extractErrorMessage } from '../../api/client';
import type { Customer } from '../../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onCreated: () => void;
}

export function NewTicketModal({ isOpen, onClose, customers, onCreated }: NewTicketModalProps) {
  const { showToast } = useToast();
  const [addingCustomer, setAddingCustomer] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: { priority: 'MEDIUM' },
  });

  const {
    register: registerCustomer,
    handleSubmit: handleCustomerSubmit,
    formState: { errors: customerErrors },
    reset: resetCustomer,
  } = useForm<CustomerFormValues>({ resolver: zodResolver(customerFormSchema) });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (customer) => {
      setValue('customerId', customer.id);
      setAddingCustomer(false);
      resetCustomer();
      showToast({ variant: 'success', message: `Added customer ${customer.name}` });
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Ticket created' });
      reset();
      onCreated();
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err, 'Could not create ticket') }),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a ticket">
      <form
        onSubmit={handleSubmit((values) => createTicketMutation.mutate(values))}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          id="new-ticket-subject"
          label="Subject"
          placeholder="What's the issue, in one line?"
          error={errors.subject?.message}
          {...register('subject')}
        />
        <Textarea
          id="new-ticket-description"
          label="Description"
          placeholder="Add any context the agent should know."
          error={errors.description?.message}
          {...register('description')}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="new-ticket-customerId" className="text-sm font-medium text-ink-800 dark:text-ink-100">
              Customer
            </label>
            <button
              type="button"
              onClick={() => setAddingCustomer((v) => !v)}
              className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400"
            >
              {addingCustomer ? 'Cancel' : '+ New customer'}
            </button>
          </div>

          {addingCustomer ? (
            <div className="flex flex-col gap-2 rounded-sm border border-dashed border-ink-200 p-3 dark:border-ink-700">
              <Input
                id="new-customer-name"
                placeholder="Name"
                error={customerErrors.name?.message}
                {...registerCustomer('name')}
              />
              <Input
                id="new-customer-email"
                placeholder="Email"
                error={customerErrors.email?.message}
                {...registerCustomer('email')}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                isLoading={createCustomerMutation.isPending}
                onClick={handleCustomerSubmit((values) => createCustomerMutation.mutate(values))}
              >
                Save customer
              </Button>
            </div>
          ) : (
            <Select id="new-ticket-customerId" {...register('customerId')}>
              <option value="">Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </Select>
          )}
          {errors.customerId && <p className="mt-1 text-xs text-danger-500">{errors.customerId.message}</p>}
        </div>

        <Select id="new-ticket-priority" label="Priority" {...register('priority')}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </Select>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || createTicketMutation.isPending}>
            Create ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
