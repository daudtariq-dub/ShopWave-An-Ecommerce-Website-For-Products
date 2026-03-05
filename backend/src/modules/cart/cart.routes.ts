import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { getCart, addItem, updateItem, removeItem, mergeCart, clearCart } from './cart.controller';
import type { AppVariables } from '../../types';

export const cartRoutes = new Hono<{ Variables: AppVariables }>();

// All cart routes require auth
cartRoutes.use('*', authMiddleware);

cartRoutes.get('/', getCart);
cartRoutes.post('/items', addItem);
cartRoutes.patch('/items/:itemId', updateItem);
cartRoutes.delete('/items/:itemId', removeItem);
cartRoutes.post('/merge', mergeCart);
cartRoutes.delete('/', clearCart);
