import axiosInstance from './axios';

export const inventoryApi = {
  getAll: (params) =>
    axiosInstance.get('/admin/inventory', { params }).then((r) => r.data),

  update: (productId, stock) =>
    axiosInstance
      .patch(`/admin/inventory/${productId}`, { stock })
      .then((r) => r.data),

  bulkUpdate: (updates) =>
    axiosInstance.put('/admin/inventory/bulk', { updates }).then((r) => r.data),
};
