// src/validations/client.validation.ts
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().url('Invalid URL').optional(),
  category: z.enum(['RETAIL', 'WHOLESALE', 'RESTAURANT', 'ECOMMERCE', 'HEALTHCARE', 'EDUCATION', 'HOSPITALITY', 'FINANCE', 'TECHNOLOGY', 'MANUFACTURING', 'OTHER']).default('OTHER'),
});

export const updateClientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().url('Invalid URL').optional(),
  category: z.enum(['RETAIL', 'WHOLESALE', 'RESTAURANT', 'ECOMMERCE', 'HEALTHCARE', 'EDUCATION', 'HOSPITALITY', 'FINANCE', 'TECHNOLOGY', 'MANUFACTURING', 'OTHER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'TRIAL']).optional(),
});