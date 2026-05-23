import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="input-group">
        {label && (
          <label className="input-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-field', error && 'input-field--error', className)}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
