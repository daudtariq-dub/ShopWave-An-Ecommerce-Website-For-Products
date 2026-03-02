import axiosInstance from './axios';

export const ordersApi = {
  getAll: (params) =>
    axiosInstance.get('/orders', { params }).then((r) => r.data),

  getById: (id) =>
    axiosInstance.get(`/orders/${id}`).then((r) => r.data),

  place: (payload) =>
    axiosInstance.post('/orders', payload).then((r) => r.data),

  cancel: (id) =>
    axiosInstance.post(`/orders/${id}/cancel`).then((r) => r.data),

  // Admin
  adminGetAll: (params) =>
    axiosInstance.get('/admin/orders', { params }).then((r) => r.data),

  adminUpdateStatus: (id, status) =>
    axiosInstance.patch(`/admin/orders/${id}`, { status }).then((r) => r.data),
};
