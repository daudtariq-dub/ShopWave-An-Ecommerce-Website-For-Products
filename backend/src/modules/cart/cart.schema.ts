import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().int().min(1),
    }),
  ),
});
