import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createCustomer } from '../../api/customers';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Seo } from '../../components/Seo';
import { useToast } from '../../components/ui/Toast';
import { extractErrorMessage } from '../../api/client';

interface FormValues {
  name: string;
  email: string;
  company?: string;
}

export function CustomerCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onTouched' });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => createCustomer(values),
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Customer created' });
      navigate('/customers');
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  return (
    <div className="flex flex-col gap-6">
      <Seo title="New Customer" description="Create a new customer record." />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-500">Create customer</p>
          <h1 className="text-3xl font-semibold">Add a new customer profile</h1>
          <p className="max-w-2xl text-sm text-ink-500 dark:text-ink-400">
            Capture customer details and keep ticket context consistent across your support team.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold">Customer details</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">Enter the customer name, email, and optional company.</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          >
            <Input id="name" label="Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input id="email" label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Input id="company" label="Company" {...register('company')} />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" isLoading={createMutation.isPending}>
                Create customer
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
