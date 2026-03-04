import { z } from 'zod';
import { SubscriptionStatus } from '../types/enums';

// ============================================================================
// Create Subscription Schemas
// ============================================================================

export const createSubscriptionSchema = z.object({
  plan: z.string()
    .min(1, 'Plan is required')
    .max(50, 'Plan name must not exceed 50 characters')
    .optional()
    .default('PREMIUM'),
  paymentMethodId: z.string()
    .min(1, 'Payment method ID cannot be empty')
    .optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const createSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    stripeSubscriptionId: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    plan: z.string(),
    currentPeriodStart: z.date(),
    currentPeriodEnd: z.date(),
    createdAt: z.date(),
  }),
  checkoutUrl: z.string().url().optional(),
});

// ============================================================================
// Get Subscription Schemas
// ============================================================================

export const getSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    stripeSubscriptionId: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    plan: z.string(),
    currentPeriodStart: z.date(),
    currentPeriodEnd: z.date(),
    createdAt: z.date(),
  }).nullable(),
  benefits: z.object({
    freeScansRemaining: z.number().int().nonnegative(),
    discountPercentage: z.number().min(0).max(100),
    prioritySupport: z.boolean(),
  }),
});

// ============================================================================
// Update Subscription Schemas
// ============================================================================

export const updateSubscriptionSchema = z.object({
  plan: z.string()
    .min(1, 'Plan cannot be empty')
    .max(50, 'Plan name must not exceed 50 characters')
    .optional(),
});

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

export const updateSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    stripeSubscriptionId: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    plan: z.string(),
    currentPeriodStart: z.date(),
    currentPeriodEnd: z.date(),
    createdAt: z.date(),
  }),
  prorationAmount: z.number().int().optional(),
  effectiveDate: z.string().datetime(),
});

// ============================================================================
// Cancel Subscription Schemas
// ============================================================================

export const cancelSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().optional().default(true),
  reason: z.string()
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;

export const cancelSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.nativeEnum(SubscriptionStatus),
    plan: z.string(),
    currentPeriodEnd: z.date(),
  }),
  cancelAt: z.string().datetime(),
});

// ============================================================================
// Reactivate Subscription Schemas
// ============================================================================

export const reactivateSubscriptionSchema = z.object({
  plan: z.string()
    .min(1, 'Plan is required')
    .max(50, 'Plan name must not exceed 50 characters')
    .optional(),
});

export type ReactivateSubscriptionInput = z.infer<typeof reactivateSubscriptionSchema>;

export const reactivateSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    stripeSubscriptionId: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    plan: z.string(),
    currentPeriodStart: z.date(),
    currentPeriodEnd: z.date(),
    createdAt: z.date(),
  }),
});

// ============================================================================
// Subscription Webhook Schemas
// ============================================================================

export const subscriptionWebhookPayloadSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  userId: z.string().uuid('Invalid user ID'),
  status: z.string().min(1, 'Status is required'),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  canceledAt: z.string().datetime().optional(),
});

export type SubscriptionWebhookPayloadInput = z.infer<typeof subscriptionWebhookPayloadSchema>;

// ============================================================================
// Get Subscription Benefits Schemas
// ============================================================================

export const getSubscriptionBenefitsResponseSchema = z.object({
  plan: z.string(),
  benefits: z.object({
    freeScansPerMonth: z.number().int().positive(),
    discountPercentage: z.number().min(0).max(100),
    prioritySupport: z.boolean(),
    earlyAccess: z.boolean(),
    customDesigns: z.boolean(),
    freeShipping: z.boolean(),
  }),
  price: z.object({
    amount: z.number().int().positive(),
    currency: z.string(),
    billingInterval: z.enum(['month', 'year']),
  }),
});

// ============================================================================
// Get Subscription Usage Schemas
// ============================================================================

export const getSubscriptionUsageResponseSchema = z.object({
  currentPeriod: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  usage: z.object({
    scansUsed: z.number().int().nonnegative(),
    scansIncluded: z.number().int().positive(),
    scansRemaining: z.number().int().nonnegative(),
    ordersPlaced: z.number().int().nonnegative(),
    discountsApplied: z.number().int().nonnegative(),
  }),
  billingHistory: z.array(z.object({
    date: z.string().datetime(),
    amount: z.number().int(),
    status: z.enum(['paid', 'pending', 'failed']),
    invoiceUrl: z.string().url().optional(),
  })).optional(),
});

// ============================================================================
// Update Payment Method Schemas
// ============================================================================

export const updatePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;

export const updatePaymentMethodResponseSchema = z.object({
  success: z.boolean(),
  paymentMethod: z.object({
    id: z.string(),
    brand: z.string(),
    last4: z.string(),
    expiryMonth: z.number().int().min(1).max(12),
    expiryYear: z.number().int(),
  }),
});

// ============================================================================
// Preview Subscription Change Schemas
// ============================================================================

export const previewSubscriptionChangeSchema = z.object({
  newPlan: z.string().min(1, 'New plan is required'),
});

export type PreviewSubscriptionChangeInput = z.infer<typeof previewSubscriptionChangeSchema>;

export const previewSubscriptionChangeResponseSchema = z.object({
  currentPlan: z.string(),
  newPlan: z.string(),
  prorationAmount: z.number().int(),
  prorationDate: z.string().datetime(),
  nextBillingDate: z.string().datetime(),
  newPrice: z.number().int(),
  benefitChanges: z.object({
    added: z.array(z.string()),
    removed: z.array(z.string()),
  }),
});
