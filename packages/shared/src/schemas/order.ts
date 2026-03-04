import { z } from 'zod';

const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().length(2, 'Country must be 2-letter code (e.g., US, CA)'),
});

export const createPaymentIntentSchema = z.object({
  orthoticDesignId: z.string().uuid('Invalid orthotic design ID'),
  shippingAddress: shippingAddressSchema,
});

export const createSubscriptionSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
