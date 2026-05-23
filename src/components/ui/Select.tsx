import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils';

type SelectOption = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, options, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="input-group">
        {label && (
          <label className="input-label" htmlFor={selectId}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn('input-field', error && 'input-field--error', className)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';
