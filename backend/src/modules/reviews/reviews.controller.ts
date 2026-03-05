import type { Context } from 'hono';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';
import type { AppVariables } from '../../types';

const reviewBody = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(1).max(2000),
});

const userSelect = { id: true, name: true, avatarUrl: true };

// GET /reviews/:productId
export const getProductReviews = async (c: Context) => {
  const { productId } = c.req.param();
  const { page = '0', limit = '10' } = c.req.query();
  const skip = parseInt(page, 10) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return c.json({
    reviews,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / take),
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
    ratingCount: agg._count.rating,
  });
};

// POST /reviews/:productId
export const upsertReview = async (c: Context<{ Variables: AppVariables }>) => {
  const { productId } = c.req.param();
  const { id: userId } = c.get('user');
  const body = reviewBody.parse(await c.req.json());

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId } },
    create: { productId, userId, ...body },
    update: { ...body },
    include: { user: { select: userSelect } },
  });

  return c.json({ review }, 201);
};

// DELETE /reviews/:productId/:reviewId
export const deleteReview = async (c: Context<{ Variables: AppVariables }>) => {
  const { reviewId } = c.req.param();
  const { id: userId, role } = c.get('user');

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found', 404);
  if (review.userId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new AppError('Forbidden', 403);
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return c.json({ ok: true });
};
