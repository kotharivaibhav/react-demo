import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Button, Input, Select } from '@/components/ui';
import { AddressFormFields } from './AddressFormFields';
import { checkoutSchema, type CheckoutFormValues } from '@/validations/schemas';

type CheckoutFormProps = {
  onSubmit: (values: CheckoutFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const CheckoutForm = ({ onSubmit, isLoading }: CheckoutFormProps) => {
  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
      },
      notes: '',
    },
  });

  const paymentMethod = useWatch({ control: methods.control, name: 'paymentMethod' });

  return (
    <FormProvider {...methods}>
      <form className="checkout-form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <section className="form-section">
          <h3 className="form-section__title">Shipping address</h3>
          <AddressFormFields namePrefix="shippingAddress" />
        </section>

        <section className="form-section">
          <h3 className="form-section__title">Payment</h3>
          <Select
            label="Payment method"
            options={[
              { value: 'card', label: 'Credit / Debit card' },
              { value: 'paypal', label: 'PayPal' },
              { value: 'cod', label: 'Cash on delivery' },
            ]}
            error={methods.formState.errors.paymentMethod?.message}
            {...methods.register('paymentMethod')}
          />

          {paymentMethod === 'card' && (
            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <Input
                label="Card number"
                placeholder="4242 4242 4242 4242"
                error={methods.formState.errors.cardNumber?.message}
                {...methods.register('cardNumber')}
              />
              <Input
                label="Expiry (MM/YY)"
                placeholder="12/28"
                error={methods.formState.errors.cardExpiry?.message}
                {...methods.register('cardExpiry')}
              />
              <Input
                label="CVV"
                placeholder="123"
                error={methods.formState.errors.cardCvv?.message}
                {...methods.register('cardCvv')}
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <Input
            label="Order notes (optional)"
            {...methods.register('notes')}
            error={methods.formState.errors.notes?.message}
          />
        </section>

        <Button type="submit" isLoading={isLoading} className="btn--lg">
          Place order
        </Button>
      </form>
    </FormProvider>
  );
};
