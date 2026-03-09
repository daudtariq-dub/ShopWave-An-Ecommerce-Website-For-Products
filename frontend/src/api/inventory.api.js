import axiosInstance from './axios';
import { normalizeProduct } from './products.api';

// Inventory items are just products with stock info
function normalizeInventoryItem(p) {
  const product = normalizeProduct(p);
  return {
    productId: product.id,
    id: product.id,
    title: product.title,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
  };
}

export const inventoryApi = {
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/products', {
      params: { limit: 100, ...params },
    });
    return { inventory: (data.products ?? []).map(normalizeInventoryItem) };
  },

  update: async (productId, stock) => {
    await axiosInstance.patch(`/admin/products/${productId}/stock`, { stock });
    return { ok: true };
  },

  bulkUpdate: async (updates) => {
    await Promise.all(
      updates.map(({ productId, stock }) =>
        axiosInstance.patch(`/admin/products/${productId}/stock`, { stock }),
      ),
    );
    return { ok: true };
  },
};
