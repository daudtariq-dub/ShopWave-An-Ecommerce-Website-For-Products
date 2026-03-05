import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { superAdminMiddleware } from '../../middleware/superAdmin';
import {
  getSuperAdminDashboard,
  getStores,
  createStore,
  updateStore,
  deleteStore,
  getSuperAdminUsers,
  getSuperAdminUserById,
  updateUserRole,
  getSuperAdminCategories,
  createSuperAdminCategory,
  deleteSuperAdminCategory,
} from './super-admin.controller';
import type { AppVariables } from '../../types';

export const superAdminRoutes = new Hono<{ Variables: AppVariables }>();

superAdminRoutes.use('*', authMiddleware, superAdminMiddleware);

superAdminRoutes.get('/dashboard', getSuperAdminDashboard);

superAdminRoutes.get('/stores', getStores);
superAdminRoutes.post('/stores', createStore);
superAdminRoutes.patch('/stores/:id', updateStore);
superAdminRoutes.delete('/stores/:id', deleteStore);

superAdminRoutes.get('/users', getSuperAdminUsers);
superAdminRoutes.get('/users/:id', getSuperAdminUserById);
superAdminRoutes.patch('/users/:id/role', updateUserRole);

superAdminRoutes.get('/categories', getSuperAdminCategories);
superAdminRoutes.post('/categories', createSuperAdminCategory);
superAdminRoutes.delete('/categories/:id', deleteSuperAdminCategory);
