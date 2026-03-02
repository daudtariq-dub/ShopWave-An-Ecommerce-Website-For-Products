import axiosInstance from './axios';

export const productsApi = {
  getAll: (params) =>
    axiosInstance.get('/products', { params }).then((r) => r.data),

  getById: (id) =>
    axiosInstance.get(`/products/${id}`).then((r) => r.data),

  getByCategory: (slug, params) =>
    axiosInstance.get(`/products/category/${slug}`, { params }).then((r) => r.data),

  getFeatured: () =>
    axiosInstance.get('/products?featured=true').then((r) => r.data),

  create: (payload) =>
    axiosInstance.post('/admin/products', payload).then((r) => r.data),

  update: (id, payload) =>
    axiosInstance.put(`/admin/products/${id}`, payload).then((r) => r.data),

  delete: (id) =>
    axiosInstance.delete(`/admin/products/${id}`).then((r) => r.data),

  getCategories: () =>
    axiosInstance.get('/categories').then((r) => r.data),

  getUploadUrl: (filename, contentType) =>
    axiosInstance
      .post('/admin/upload-url', { filename, contentType })
      .then((r) => r.data),
};
