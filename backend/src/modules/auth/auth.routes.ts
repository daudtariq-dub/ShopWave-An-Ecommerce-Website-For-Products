import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { register, login, me, logout, updateProfile, googleAuth } from './auth.controller';
import type { AppVariables } from '../../types';

export const authRoutes = new Hono<{ Variables: AppVariables }>();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/google', googleAuth);
authRoutes.get('/me', authMiddleware, me);
authRoutes.post('/logout', authMiddleware, logout);
authRoutes.patch('/profile', authMiddleware, updateProfile);
