import type { Context } from 'hono';
import { prisma } from '../../lib/prisma';

// GET /categories
export const getCategories = async (c: Context) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return c.json({ categories });
};
