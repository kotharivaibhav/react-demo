import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { AddressFormFields } from './AddressFormFields';
import { profileUpdateSchema, type ProfileUpdateFormValues } from '@/validations/schemas';
import type { User } from '@/types';

type ProfileUpdateFormProps = {
  user: User;
  onSubmit: (values: ProfileUpdateFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const ProfileUpdateForm = ({ user, onSubmit, isLoading }: ProfileUpdateFormProps) => {
  const methods = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      address: user.address ?? {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
      },
    },
  });

  useEffect(() => {
    methods.reset({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      address: user.address,
    });
  }, [user, methods]);

  return (
    <FormProvider {...methods}>
      <form className="auth-form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          error={methods.formState.errors.name?.message}
          {...methods.register('name')}
        />
        <Input
          label="Email"
          type="email"
          error={methods.formState.errors.email?.message}
          {...methods.register('email')}
        />
        <Input
          label="Phone"
          error={methods.formState.errors.phone?.message}
          {...methods.register('phone')}
        />

        <h3 className="form-section__title" style={{ marginTop: '0.5rem' }}>
          Address
        </h3>
        <AddressFormFields namePrefix="address" />

        <Button type="submit" isLoading={isLoading}>
          Save changes
        </Button>
      </form>
    </FormProvider>
  );
};
