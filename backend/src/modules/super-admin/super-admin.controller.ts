import type { Context } from 'hono';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';
import { z } from 'zod';
import type { AppVariables } from '../../types';

const storeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  policies: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  storeId: z.string().nullable().optional(),
});

// GET /super-admin/stores
export const getStores = async (c: Context<{ Variables: AppVariables }>) => {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { users: true, products: true } },
    },
  });
  return c.json({ stores });
};

// POST /super-admin/stores
export const createStore = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const { adminEmail, ...storeData } = body;
  const data = storeSchema.parse(storeData);
  const store = await prisma.store.create({ data });

  let generatedPassword: string | null = null;

  if (adminEmail) {
    let user = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!user) {
      // Create the user with a random password
      const bcrypt = await import('bcryptjs');
      generatedPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase() + '!';
      const hashed = await bcrypt.hash(generatedPassword, 12);
      const nameFromEmail = adminEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      user = await prisma.user.create({
        data: { name: nameFromEmail, email: adminEmail, password: hashed, role: 'ADMIN', storeId: store.id },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN', storeId: store.id },
      });
    }
  }

  return c.json({ store, generatedPassword }, 201);
};

// PATCH /super-admin/stores/:id
export const updateStore = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = storeSchema.partial().parse(body);
  const existing = await prisma.store.findUnique({ where: { id } });
  if (!existing) throw new AppError('Store not found', 404);
  const store = await prisma.store.update({ where: { id }, data });
  return c.json({ store });
};

// DELETE /super-admin/stores/:id
export const deleteStore = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const existing = await prisma.store.findUnique({ where: { id } });
  if (!existing) throw new AppError('Store not found', 404);
  await prisma.store.delete({ where: { id } });
  return c.json({ ok: true });
};

// GET /super-admin/users
export const getSuperAdminUsers = async (c: Context<{ Variables: AppVariables }>) => {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        storeId: true,
        store: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count(),
  ]);

  return c.json({ users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};

// GET /super-admin/users/:id
export const getSuperAdminUserById = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      storeId: true,
      store: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
      orders: {
        select: { id: true, totalAmount: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return c.json({ user });
};

// PATCH /super-admin/users/:id/role
export const updateUserRole = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const { role, storeId } = updateUserRoleSchema.parse(body);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new AppError('User not found', 404);

  const updateData: Record<string, unknown> = { role };
  if (storeId !== undefined) updateData.storeId = storeId;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, storeId: true },
  });
  return c.json({ user });
};

// GET /super-admin/categories
export const getSuperAdminCategories = async (c: Context<{ Variables: AppVariables }>) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return c.json({ categories });
};

// POST /super-admin/categories
export const createSuperAdminCategory = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const { name } = z.object({ name: z.string().min(1) }).parse(body);
  const category = await prisma.category.create({ data: { name } });
  return c.json({ category }, 201);
};

// DELETE /super-admin/categories/:id
export const deleteSuperAdminCategory = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found', 404);
  await prisma.category.delete({ where: { id } });
  return c.json({ ok: true });
};

// GET /super-admin/dashboard
export const getSuperAdminDashboard = async (c: Context<{ Variables: AppVariables }>) => {
  const [totalStores, totalUsers, totalOrders, revenueResult] = await Promise.all([
    prisma.store.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } },
    }),
  ]);

  return c.json({
    stats: {
      totalStores,
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult._sum.totalAmount ?? 0,
    },
  });
};
