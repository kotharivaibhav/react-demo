import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { loginSchema, type LoginFormValues } from '@/validations/schemas';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="admin@test.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isLoading} className="btn--lg">
        Sign in
      </Button>
    </form>
  );
};
