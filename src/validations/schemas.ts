import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code'),
  country: z.string().min(2, 'Country is required'),
});

export const checkoutSchema = z
  .object({
    shippingAddress: addressSchema,
    paymentMethod: z.enum(['card', 'paypal', 'cod'], {
      message: 'Select a payment method',
    }),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'card') {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
        ctx.addIssue({
          code: 'custom',
          message: 'Valid card number required',
          path: ['cardNumber'],
        });
      }
      if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({ code: 'custom', message: 'Use MM/YY format', path: ['cardExpiry'] });
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        ctx.addIssue({ code: 'custom', message: 'Valid CVV required', path: ['cardCvv'] });
      }
    }
  });

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?[\d\s-]{10,}$/.test(v), 'Invalid phone number'),
  address: addressSchema.optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
