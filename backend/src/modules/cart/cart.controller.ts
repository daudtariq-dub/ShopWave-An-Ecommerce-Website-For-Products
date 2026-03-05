import type { Context } from 'hono';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';
import { addItemSchema, updateItemSchema, mergeCartSchema } from './cart.schema';
import type { AppVariables } from '../../types';

const cartInclude = {
  items: {
    include: {
      product: {
        select: { id: true, name: true, price: true, imageUrl: true, stock: true },
      },
    },
  },
} as const;

// Gets or creates the single cart for this user
const getOrCreateCart = (userId: string) =>
  prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });

// GET /cart
export const getCart = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const cart = await getOrCreateCart(userId);
  return c.json({ cart });
};

// POST /cart/items
export const addItem = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const body = await c.req.json();
  const { productId, quantity } = addItemSchema.parse(body);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError('Not enough stock', 400);

  const cart = await getOrCreateCart(userId);

  // Upsert: increment if already in cart, insert if not
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
  });

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: cartInclude });
  return c.json({ cart: updated }, 201);
};

// PATCH /cart/items/:itemId
export const updateItem = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const { itemId } = c.req.param();
  const body = await c.req.json();
  const { quantity } = updateItemSchema.parse(body);

  // Ensure the item belongs to this user's cart
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
  });
  if (!item) throw new AppError('Cart item not found', 404);

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

  const cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  return c.json({ cart });
};

// DELETE /cart/items/:itemId
export const removeItem = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const { itemId } = c.req.param();

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
  });
  if (!item) throw new AppError('Cart item not found', 404);

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  return c.json({ cart });
};

// DELETE /cart  — clears all items from the user's cart
export const clearCart = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return c.json({ ok: true });
};

// POST /cart/merge  — merges guest cart items into the authenticated user's cart
export const mergeCart = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const body = await c.req.json();
  const { items } = mergeCartSchema.parse(body);

  const cart = await getOrCreateCart(userId);

  // For each guest item, upsert into the DB cart (add quantities together)
  await Promise.all(
    items.map((item) =>
      prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
        update: { quantity: { increment: item.quantity } },
        create: { cartId: cart.id, productId: item.productId, quantity: item.quantity },
      }),
    ),
  );

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: cartInclude });
  return c.json({ cart: updated });
};
