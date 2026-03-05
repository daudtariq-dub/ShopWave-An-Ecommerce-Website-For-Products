import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(
  (data) => {
    // if newPassword is provided, currentPassword must also be provided
    if (data.newPassword && !data.currentPassword) return false;
    return true;
  },
  { message: 'Current password is required to set a new password', path: ['currentPassword'] },
);
