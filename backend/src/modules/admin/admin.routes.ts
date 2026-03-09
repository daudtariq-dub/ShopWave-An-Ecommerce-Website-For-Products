import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import {
  getDashboard,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
  getAdminUserById,
  updateAdminProfile,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getProductUploadUrl,
} from './admin.controller';
import type { AppVariables } from '../../types';

export const adminRoutes = new Hono<{ Variables: AppVariables }>();

// All admin routes require auth + ADMIN role
adminRoutes.use('*', authMiddleware, adminMiddleware);

adminRoutes.get('/dashboard', getDashboard);

// Product CRUD
adminRoutes.get('/products', getAdminProducts);
adminRoutes.get('/products/upload-url', getProductUploadUrl);
adminRoutes.post('/products', createProduct);
adminRoutes.patch('/products/:id', updateProduct);
adminRoutes.delete('/products/:id', deleteProduct);
adminRoutes.patch('/products/:id/stock', updateProductStock);
adminRoutes.get('/orders', getAdminOrders);
adminRoutes.patch('/orders/:id/status', updateOrderStatus);
adminRoutes.get('/users', getAdminUsers);
adminRoutes.get('/users/:id', getAdminUserById);
adminRoutes.patch('/profile', updateAdminProfile);
