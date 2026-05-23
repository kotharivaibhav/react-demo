import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { signupSchema, type SignupFormValues } from '@/validations/schemas';

type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Full name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirm password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" isLoading={isLoading} className="btn--lg">
        Create account
      </Button>
    </form>
  );
};
