import type { Context } from 'hono';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';
import { z } from 'zod';
import type { AppVariables } from '../../types';
import { getPresignedUploadUrl } from '../../lib/s3';
import { elasticIndex } from '../../lib/elasticIndex';
import { algoliaIndex } from '../../lib/algolia';

// ── Product CRUD schemas ──────────────────────────────────────────────────────
const productBody = z.object({
  // Accept both frontend naming (title/image/category) and canonical naming (name/imageUrl/categoryId)
  name: z.string().optional(),
  title: z.string().optional(),           // alias for name (frontend form field)
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  imageUrl: z.string().optional(),
  image: z.string().optional(),           // alias for imageUrl
  images: z.array(z.string()).optional(), // multiple images — first one used
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().optional(),
  category: z.string().optional(),        // category name — will upsert Category row
  sku: z.string().optional(),             // ignored, stored as-is if needed
});

const productInclude = {
  category: { select: { id: true, name: true } },
  store: { select: { id: true, name: true } },
} as const;

async function resolveProductData(raw: z.infer<typeof productBody>) {
  const name = raw.name ?? raw.title;
  if (!name) throw new AppError('Product name is required', 400);

  const imageUrl = raw.images?.[0] ?? raw.imageUrl ?? raw.image ?? '';

  let categoryId = raw.categoryId;
  if (!categoryId && raw.category) {
    const cat = await prisma.category.upsert({
      where: { name: raw.category },
      update: {},
      create: { name: raw.category },
    });
    categoryId = cat.id;
  }
  if (!categoryId) throw new AppError('Category is required', 400);

  return { name, description: raw.description, price: raw.price, imageUrl, stock: raw.stock, categoryId };
}

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: {
    include: { product: { select: { id: true, name: true, imageUrl: true } } },
  },
} as const;

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

const updateAdminProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(
  (data) => !(data.newPassword && !data.currentPassword),
  { message: 'Current password is required to set a new password', path: ['currentPassword'] },
);

// GET /admin/dashboard
export const getDashboard = async (c: Context<{ Variables: AppVariables }>) => {
  const { storeId } = c.get('user');
  const orderWhere = storeId
    ? { items: { some: { product: { storeId } } } }
    : {};

  const [
    totalUsers,
    totalOrders,
    revenueResult,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: orderWhere }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { ...orderWhere, status: { not: 'CANCELLED' } },
    }),
    prisma.order.groupBy({ by: ['status'], _count: { id: true }, where: orderWhere }),
    prisma.order.findMany({
      where: orderWhere,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  return c.json({
    stats: {
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult._sum.totalAmount ?? 0,
    },
    ordersByStatus: ordersByStatus.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {}),
    recentOrders,
  });
};

// GET /admin/orders
export const getAdminOrders = async (c: Context<{ Variables: AppVariables }>) => {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const skip = (page - 1) * limit;

  const { storeId } = c.get('user');
  const storeFilter = storeId ? { items: { some: { product: { storeId } } } } : {};
  const where = { ...storeFilter, ...(query.status ? { status: query.status as never } : {}) };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, skip, take: limit, include: orderInclude, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where }),
  ]);

  return c.json({ orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};

// PATCH /admin/orders/:id/status
export const updateOrderStatus = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const { status } = updateOrderStatusSchema.parse(body);
  const { storeId } = c.get('user');

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError('Order not found', 404);

  if (storeId) {
    const hasStoreItem = await prisma.orderItem.findFirst({ where: { orderId: id, product: { storeId } } });
    if (!hasStoreItem) throw new AppError('Order not found', 404);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });

  return c.json({ order: updated });
};

// GET /admin/users
export const getAdminUsers = async (c: Context<{ Variables: AppVariables }>) => {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, select: safeUserSelect, orderBy: { createdAt: 'desc' } }),
    prisma.user.count(),
  ]);

  return c.json({ users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};

// GET /admin/users/:id
export const getAdminUserById = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...safeUserSelect,
      orders: { select: { id: true, totalAmount: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return c.json({ user });
};

// GET /admin/products
export const getAdminProducts = async (c: Context<{ Variables: AppVariables }>) => {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const skip = (page - 1) * limit;
  const { storeId } = c.get('user');

  const where: Record<string, unknown> = storeId ? { storeId } : {};

  if (query.category) where.category = { name: query.category };
  if (query.search) where.name = { contains: query.search, mode: 'insensitive' };
  if (query.minPrice || query.maxPrice) {
    const price: Record<string, number> = {};
    if (query.minPrice) price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) price.lte = parseFloat(query.maxPrice);
    where.price = price;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, include: productInclude, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  return c.json({ products, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};

// POST /admin/products
export const createProduct = async (c: Context<{ Variables: AppVariables }>) => {
  const body = await c.req.json();
  const raw = productBody.parse(body);
  const data = await resolveProductData(raw);
  const { storeId } = c.get('user');
  const product = await prisma.product.create({
    data: { ...data, ...(storeId ? { storeId } : {}) },
    include: productInclude,
  });
  elasticIndex.upsert(product);
  algoliaIndex.upsert(product);
  return c.json({ product }, 201);
};

// PATCH /admin/products/:id
export const updateProduct = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const raw = productBody.partial().parse(body);
  const { storeId } = c.get('user');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found', 404);
  if (storeId && existing.storeId !== storeId) throw new AppError('Product not found', 404);
  // Only resolve fields that were provided
  const update: Record<string, unknown> = {};
  if (raw.name ?? raw.title) update.name = raw.name ?? raw.title;
  if (raw.description) update.description = raw.description;
  if (raw.price != null) update.price = raw.price;
  if (raw.stock != null) update.stock = raw.stock;
  if (raw.images?.[0] ?? raw.imageUrl ?? raw.image) {
    update.imageUrl = raw.images?.[0] ?? raw.imageUrl ?? raw.image;
  }
  if (raw.categoryId ?? raw.category) {
    if (raw.categoryId) {
      update.categoryId = raw.categoryId;
    } else {
      const cat = await prisma.category.upsert({
        where: { name: raw.category! },
        update: {},
        create: { name: raw.category! },
      });
      update.categoryId = cat.id;
    }
  }
  const product = await prisma.product.update({ where: { id }, data: update, include: productInclude });
  elasticIndex.upsert(product);
  algoliaIndex.upsert(product);
  return c.json({ product });
};

// DELETE /admin/products/:id
export const deleteProduct = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const { storeId } = c.get('user');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found', 404);
  if (storeId && existing.storeId !== storeId) throw new AppError('Product not found', 404);
  await prisma.product.delete({ where: { id } });
  elasticIndex.delete(id);
  algoliaIndex.delete(id);
  return c.json({ ok: true });
};

// PATCH /admin/products/:id/stock
export const updateProductStock = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const { stock } = z.object({ stock: z.coerce.number().int().min(0) }).parse(body);
  const { storeId } = c.get('user');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found', 404);
  if (storeId && existing.storeId !== storeId) throw new AppError('Product not found', 404);
  const product = await prisma.product.update({ where: { id }, data: { stock }, include: productInclude });
  return c.json({ product });
};

// GET /admin/products/upload-url
export const getProductUploadUrl = async (c: Context<{ Variables: AppVariables }>) => {
  const { filename = 'image.jpg', contentType = 'image/jpeg' } = c.req.query();
  const ext = filename.split('.').pop() ?? 'jpg';
  const key = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);
  return c.json({ uploadUrl, publicUrl });
};

// PATCH /admin/profile
export const updateAdminProfile = async (c: Context<{ Variables: AppVariables }>) => {
  const { id } = c.get('user');
  const body = await c.req.json();
  const data = updateAdminProfileSchema.parse(body);

  if (data.newPassword) {
    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin?.password) throw new AppError('Cannot change password for this account', 400);
    const valid = await bcrypt.compare(data.currentPassword!, admin.password);
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
