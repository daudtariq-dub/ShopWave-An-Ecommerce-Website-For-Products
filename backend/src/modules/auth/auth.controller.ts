import type { Context } from 'hono';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../lib/prisma';
import { signToken } from '../../lib/jwt';
import { AppError } from '../../middleware/error';
import { registerSchema, loginSchema, updateProfileSchema, googleAuthSchema } from './auth.schema';
import type { AppVariables } from '../../types';
import { env } from '../../config/env';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// Columns returned to the client — password never included
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  storeId: true,
  createdAt: true,
  updatedAt: true,
} as const;

// POST /auth/register
export const register = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const data = registerSchema.parse(body);

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed },
    select: safeUserSelect,
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role, storeId: user.storeId });
  return c.json({ token, user }, 201);
};

// POST /auth/login
export const login = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const data = loginSchema.parse(body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.password) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = signToken({ id: user.id, email: user.email, role: user.role, storeId: user.storeId });
  const { password: _, ...safeUser } = user;
  return c.json({ token, user: safeUser });
};

// GET /auth/me
export const me = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.get('user');
  const user = await prisma.user.findUnique({ where: { id }, select: safeUserSelect });
  if (!user) throw new AppError('User not found', 404);
  return c.json({ user });
};

// POST /auth/google
export const googleAuth = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const { credential } = googleAuthSchema.parse(body);

  // Verify the Google id_token
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  }).catch(() => { throw new AppError('Invalid Google credential', 401); });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError('Google account has no email', 400);

  // Upsert user — find by googleId first, then by email
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: payload.sub }, { email: payload.email }] },
    select: safeUserSelect,
  });

  if (user) {
    // Attach googleId if the user registered by email previously
    await prisma.user.update({
      where: { id: user.id },
      data: { googleId: payload.sub, avatarUrl: payload.picture ?? undefined },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: payload.name ?? payload.email,
        email: payload.email,
        googleId: payload.sub,
        avatarUrl: payload.picture,
      },
      select: safeUserSelect,
    });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, storeId: user.storeId });
  return c.json({ token, user });
};

// POST /auth/logout
export const logout = (c: Context<{ Variables: AppVariables }>) => {
  // Stateless JWT — client drops the token. Nothing to invalidate server-side.
  return c.json({ message: 'Logged out successfully' });
};

// PATCH /auth/profile
export const updateProfile = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.get('user');
  const body = await c.req.json();
  const data = updateProfileSchema.parse(body);

  // Password change flow
  if (data.newPassword) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user?.password) throw new AppError('Cannot change password for this account', 400);
    const valid = await bcrypt.compare(data.currentPassword!, user.password);
    if (!valid) throw new AppError('Current password is incorrect', 401);
  }

  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
  if (data.newPassword) updateData.password = await bcrypt.hash(data.newPassword, 12);

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: safeUserSelect,
  });

  return c.json({ user: updated });
};
