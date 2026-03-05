import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { ZodError } from 'zod';
import { AppError } from './middleware/error';
import type { AppVariables } from './types';

// Route imports — uncommented as each phase is completed
import { authRoutes } from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';
import { categoriesRoutes } from './modules/categories/categories.routes';
import { cartRoutes } from './modules/cart/cart.routes';
import { ordersRoutes } from './modules/orders/orders.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { searchRoutes } from './modules/search/search.routes';
import { superAdminRoutes } from './modules/super-admin/super-admin.routes';
import { reviewsRoutes } from './modules/reviews/reviews.routes';

const app = new Hono<{ Variables: AppVariables }>();

// ── Global middleware ────────────────────────────────────────────────────────
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.route('/auth', authRoutes);
app.route('/products', productsRoutes);
app.route('/categories', categoriesRoutes);
app.route('/cart', cartRoutes);
app.route('/orders', ordersRoutes);
app.route('/admin', adminRoutes);
app.route('/super-admin', superAdminRoutes);
app.route('/search', searchRoutes);
app.route('/reviews', reviewsRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Route not found' }, 404));

// ── Global error handler ──────────────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as Parameters<typeof c.json>[1]);
  }

  if (err instanceof ZodError) {
    return c.json(
      { error: 'Validation failed', details: err.issues.map((e) => ({ path: e.path.join('.'), message: e.message })) },
      400,
    );
  }

  // Prisma known request errors (P2002 = unique violation, P2025 = not found)
  const prismaCode = (err as unknown as { code?: string }).code;
  if (prismaCode === 'P2002') return c.json({ error: 'Resource already exists' }, 409);
  if (prismaCode === 'P2025') return c.json({ error: 'Resource not found' }, 404);

  console.error('[Unhandled Error]', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
