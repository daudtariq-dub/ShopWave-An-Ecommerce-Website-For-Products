import type { Context } from 'hono';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';

// GET /products?page=1&limit=12&category=&search=&minPrice=&maxPrice=
export const getProducts = async (c: Context) => {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '12', 10)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query.category) {
    where.category = { name: query.category };
  }

  if (query.search) {
    where.name = { contains: query.search, mode: 'insensitive' };
  }

  if (query.minPrice || query.maxPrice) {
    const price: Record<string, number> = {};
    if (query.minPrice) price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) price.lte = parseFloat(query.maxPrice);
    where.price = price;
  }

  const productInclude = {
    category: { select: { id: true, name: true } },
    store: { select: { id: true, name: true } },
  } as const;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  const productIds = products.map((p) => p.id);
  const reviewStats = await prisma.review.groupBy({
    by: ['productId'],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });
  const statsMap = Object.fromEntries(reviewStats.map((s) => [s.productId, s]));

  const productsWithRating = products.map((p) => ({
    ...p,
    rating: {
      rate: statsMap[p.id] ? Math.round((statsMap[p.id]._avg.rating ?? 0) * 10) / 10 : null,
      count: statsMap[p.id]?._count.rating ?? 0,
    },
  }));

  return c.json({
    products: productsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// GET /products/:id
export const getProductById = async (c: Context) => {
  const { id } = c.req.param();
  const [product, reviewStats] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        store: { select: { id: true, name: true } },
      },
    }),
    prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);
  if (!product) throw new AppError('Product not found', 404);
  return c.json({
    product: {
      ...product,
      rating: {
        rate: reviewStats._avg.rating ? Math.round(reviewStats._avg.rating * 10) / 10 : null,
        count: reviewStats._count.rating,
      },
    },
  });
};
