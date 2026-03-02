import axiosInstance from './axios';

export const cartApi = {
  getCart: () =>
    axiosInstance.get('/cart').then((r) => r.data),

  syncCart: (items) =>
    axiosInstance.put('/cart', { items }).then((r) => r.data),

  mergeCart: (guestItems) =>
    axiosInstance.post('/cart/merge', { items: guestItems }).then((r) => r.data),

  addItem: (productId, quantity) =>
    axiosInstance.post('/cart/items', { productId, quantity }).then((r) => r.data),

  updateItem: (productId, quantity) =>
    axiosInstance.put(`/cart/items/${productId}`, { quantity }).then((r) => r.data),

  removeItem: (productId) =>
    axiosInstance.delete(`/cart/items/${productId}`).then((r) => r.data),

  clearCart: () =>
    axiosInstance.delete('/cart').then((r) => r.data),
};
