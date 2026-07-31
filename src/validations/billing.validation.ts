// src/validations/billing.validation.ts
import { z } from 'zod';

export const createInvoiceSchema = z.object({
  clientId: z.string(),
  subscriptionId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  dueDate: z.string().datetime('Invalid date format'),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive(),
  })),
});

export const createPaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  method: z.enum(['CARD', 'MPESA', 'PAYPAL', 'BANK_TRANSFER']),
  reference: z.string().optional(),
});