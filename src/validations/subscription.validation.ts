// src/validations/subscription.validation.ts
import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  clientId: z.string().optional(),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']),
  autoRenew: z.boolean().default(true),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
  productIds: z.array(z.string()).min(1, 'At least one product is required'),
});

export const updateSubscriptionSchema = z.object({
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED']).optional(),
  autoRenew: z.boolean().optional(),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  endDate: z.string().datetime().optional(),
});