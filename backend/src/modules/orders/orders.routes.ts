import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { placeOrder, getMyOrders, getOrderById, cancelOrder } from './orders.controller';
import type { AppVariables } from '../../types';

export const ordersRoutes = new Hono<{ Variables: AppVariables }>();

ordersRoutes.use('*', authMiddleware);

ordersRoutes.post('/', placeOrder);
ordersRoutes.get('/my', getMyOrders);
ordersRoutes.get('/:id', getOrderById);
ordersRoutes.patch('/:id/cancel', cancelOrder);
