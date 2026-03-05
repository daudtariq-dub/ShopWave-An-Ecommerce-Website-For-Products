import axiosInstance from './axios';

// Maps backend order shape → frontend shape
function normalizeOrder(o) {
  return {
    id: o.id,
    total: o.totalAmount,
    totalAmount: o.totalAmount,
    status: (o.status ?? '').toLowerCase(),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    shippingAddress: o.shippingAddress,
    user: o.user,
    customer: o.user,
    items: (o.items ?? []).map((item) => ({
      id: item.id,
      productId: item.productId ?? item.product?.id,
      title: item.product?.name ?? item.title ?? '',
      name: item.product?.name ?? item.title ?? '',
      image: item.product?.imageUrl ?? item.imageUrl ?? '',
      imageUrl: item.product?.imageUrl ?? item.imageUrl ?? '',
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

export const ordersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/orders/my');
    return { orders: (data.orders ?? []).map(normalizeOrder) };
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    return normalizeOrder(data.order);
  },

  place: async ({ items, shippingAddress }) => {
    const { data } = await axiosInstance.post('/orders', { shippingAddress, items });
    return normalizeOrder(data.order);
  },

  cancel: async (id) => {
    const { data } = await axiosInstance.patch(`/orders/${id}/cancel`);
    return normalizeOrder(data.order);
  },

  // Admin
  adminGetAll: async (params = {}) => {
    const normalized = { ...params };
    if (normalized.status) normalized.status = normalized.status.toUpperCase();
    const { data } = await axiosInstance.get('/admin/orders', { params: normalized });
    return {
      orders: (data.orders ?? []).map(normalizeOrder),
      pagination: data.pagination,
    };
  },

  adminUpdateStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(`/admin/orders/${id}/status`, {
      status: status.toUpperCase(),
    });
    return normalizeOrder(data.order);
  },
};
