import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  roles: z.array(z.enum(['engineer', 'manager', 'admin', 'supervisor'])).optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  role: z.enum(['engineer', 'manager', 'admin', 'supervisor']).optional(),
  email: z.string().optional(),
});

