import { z } from 'zod';

export const placeOrderSchema = z.object({
  shippingAddress: z.object({
    // Accept both frontend and generic field names
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),   // frontend sends "address"
    street: z.string().optional(),    // alternative
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().optional(), // frontend sends "postalCode"
    zip: z.string().optional(),        // alternative
    country: z.string().min(1, 'Country is required'),
  }),
  // Optional: provide items directly instead of reading from DB cart
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
});
