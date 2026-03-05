import { createMiddleware } from 'hono/factory';
import { AppError } from './error';
import type { AppVariables } from '../types';

export const adminMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw new AppError('Forbidden', 403);
    }
    await next();
  },
);
