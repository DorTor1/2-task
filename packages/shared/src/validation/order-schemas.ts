import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const orderCreateSchema = z.object({
  userId: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const orderUpdateStatusSchema = z.object({
  status: z.enum(['created', 'in_progress', 'completed', 'cancelled']),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  status: z.enum(['created', 'in_progress', 'completed', 'cancelled']).optional(),
  sort: z.enum(['createdAt', 'status']).optional(),
  direction: z.enum(['asc', 'desc']).optional(),
});

