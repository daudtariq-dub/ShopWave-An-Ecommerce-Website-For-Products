import axiosInstance from './axios';

export const storesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/super-admin/stores');
    return data;
  },
  create: async (storeData) => {
    const { data } = await axiosInstance.post('/super-admin/stores', storeData);
    return data;
  },
  update: async (id, storeData) => {
    const { data } = await axiosInstance.patch(`/super-admin/stores/${id}`, storeData);
    return data;
  },
  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/super-admin/stores/${id}`);
    return data;
  },
};

export const superAdminApi = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get('/super-admin/dashboard');
    return data;
  },
  getUsers: async (params = {}) => {
    const { data } = await axiosInstance.get('/super-admin/users', { params });
    return data;
  },
  getUserById: async (id) => {
    const { data } = await axiosInstance.get(`/super-admin/users/${id}`);
    return data;
  },
  updateUserRole: async (id, role, storeId) => {
    const { data } = await axiosInstance.patch(`/super-admin/users/${id}/role`, { role, storeId });
    return data;
  },
  getCategories: async () => {
    const { data } = await axiosInstance.get('/super-admin/categories');
    return data;
  },
  createCategory: async (name) => {
    const { data } = await axiosInstance.post('/super-admin/categories', { name });
    return data;
  },
  deleteCategory: async (id) => {
    const { data } = await axiosInstance.delete(`/super-admin/categories/${id}`);
    return data;
  },
};
