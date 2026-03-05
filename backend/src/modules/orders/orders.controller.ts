import type { Context } from 'hono';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error';
import { placeOrderSchema } from './orders.schema';
import type { AppVariables } from '../../types';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
} as const;

// POST /orders
export const placeOrder = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const body = await c.req.json();
  const { shippingAddress, items: bodyItems } = placeOrderSchema.parse(body);

  let lineItems: { productId: string; quantity: number }[];

  if (bodyItems && bodyItems.length > 0) {
    // Items provided directly in the request body — skip DB cart
    lineItems = bodyItems;
  } else {
    // Fall back to reading from the user's DB cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty', 400);
    }
    lineItems = cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
  }

  // Load all products for validation and pricing
  const products = await prisma.product.findMany({
    where: { id: { in: lineItems.map((i) => i.productId) } },
  });

  if (products.length !== lineItems.length) {
    throw new AppError('One or more products not found', 404);
  }

  for (const line of lineItems) {
    const product = products.find((p) => p.id === line.productId)!;
    if (product.stock < line.quantity) {
      throw new AppError(`Insufficient stock for "${product.name}"`, 400);
    }
  }

  const totalAmount = lineItems.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId)!;
    return sum + product.price * line.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        items: {
          create: lineItems.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            price: products.find((p) => p.id === line.productId)!.price,
          })),
        },
      },
      include: orderInclude,
    });

    await Promise.all(
      lineItems.map((line) =>
        tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        }),
      ),
    );

    // Clear the DB cart if it exists
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return newOrder;
  });

  return c.json({ order }, 201);
};

// GET /orders/my
export const getMyOrders = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const orders = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return c.json({ orders });
};

// GET /orders/:id
export const getOrderById = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const { id } = c.req.param();

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: orderInclude,
  });

  if (!order) throw new AppError('Order not found', 404);
  return c.json({ order });
};

// PATCH /orders/:id/cancel
export const cancelOrder = async (c: Context<{ Variables: AppVariables }>) => {
  const { id: userId } = c.get('user');
  const { id } = c.req.param();

  const order = await prisma.order.findFirst({ where: { id, userId } });
  if (!order) throw new AppError('Order not found', 404);
  if (order.status === 'CANCELLED') throw new AppError('Order is already cancelled', 400);
  if (order.status === 'DELIVERED') throw new AppError('Cannot cancel a delivered order', 400);

  const updated = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: orderInclude,
  });

  return c.json({ order: updated });
};
