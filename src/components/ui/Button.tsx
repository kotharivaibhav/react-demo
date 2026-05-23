import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={cn('btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? 'Loading...' : children}
  </button>
);
