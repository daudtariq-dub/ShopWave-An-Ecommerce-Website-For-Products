/** Mock orders API — stores orders in localStorage */
import { MOCK_ORDERS, delay } from './mock';

const STORAGE_KEY = 'mock_orders';

const getOrders = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [...MOCK_ORDERS]; }
  catch { return [...MOCK_ORDERS]; }
};
const saveOrders = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

export const ordersApi = {
  getAll: async () => {
    await delay(400);
    return { orders: getOrders() };
  },

  getById: async (id) => {
    await delay(300);
    const order = getOrders().find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  place: async (payload) => {
    await delay(700);
    const order = {
      id: 'ORD-' + String(Date.now()).slice(-6),
      createdAt: new Date().toISOString(),
      status: 'processing',
      total: payload.total,
      items: payload.items,
      shippingAddress: payload.shippingAddress,
    };
    const existing = getOrders();
    saveOrders([order, ...existing]);
    return order;
  },

  cancel: async (id) => {
    await delay(400);
    const orders = getOrders().map((o) => o.id === id ? { ...o, status: 'cancelled' } : o);
    saveOrders(orders);
    return { ok: true };
  },

  // Admin
  adminGetAll: async () => {
    await delay(400);
    return { orders: getOrders() };
  },

  adminUpdateStatus: async (id, status) => {
    await delay(400);
    const orders = getOrders().map((o) => o.id === id ? { ...o, status } : o);
    saveOrders(orders);
    return { ok: true };
  },
};
