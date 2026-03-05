import { createMiddleware } from 'hono/factory';
import { verifyToken } from '../lib/jwt';
import { AppError } from './error';
import type { AppVariables } from '../types';

export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    c.set('user', payload);
    await next();
  },
);
