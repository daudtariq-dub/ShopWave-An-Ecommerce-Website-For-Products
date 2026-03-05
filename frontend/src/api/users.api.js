import axiosInstance from './axios';

function normalizeUser(u) {
  if (!u) return u;
  const orders = u.orders ?? [];
  return {
    ...u,
    role: u.role?.toLowerCase(),
    status: 'active', // backend doesn't track status; default active
    joinedAt: u.createdAt,
    lastActiveAt: u.updatedAt,
    totalOrders: u.totalOrders ?? orders.length,
    totalSpent: u.totalSpent ?? orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0),
  };
}

export const usersApi = {
  adminGetAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/users', { params });
    return { users: (data.users ?? []).map(normalizeUser), pagination: data.pagination };
  },

  adminGetById: async (id) => {
    const { data } = await axiosInstance.get(`/admin/users/${id}`);
    return normalizeUser(data.user);
  },
};
