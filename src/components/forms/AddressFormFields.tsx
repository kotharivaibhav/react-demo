import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui';

type AddressFormFieldsProps = {
  namePrefix: 'shippingAddress' | 'address';
};

const fieldKeys = ['street', 'city', 'state', 'zip', 'country'] as const;

export const AddressFormFields = ({ namePrefix }: AddressFormFieldsProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const getError = (key: (typeof fieldKeys)[number]): string | undefined => {
    const branch = (errors as Record<string, Record<string, { message?: string }>>)[namePrefix];
    return branch?.[key]?.message;
  };

  const labels: Record<(typeof fieldKeys)[number], string> = {
    street: 'Street address',
    city: 'City',
    state: 'State / Province',
    zip: 'ZIP / Postal code',
    country: 'Country',
  };

  return (
    <div className="form-grid">
      {fieldKeys.map((key) => (
        <Input
          key={key}
          label={labels[key]}
          error={getError(key)}
          {...register(`${namePrefix}.${key}`)}
        />
      ))}
    </div>
  );
};
