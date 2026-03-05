import axiosInstance from './axios';

// Maps backend CartItem shape → frontend cart item shape
export function normalizeCartItem(item) {
  return {
    id: item.product.id,           // product.id is the item key in frontend
    cartItemId: item.id,           // CartItem.id for backend ops
    title: item.product.name,
    name: item.product.name,
    price: item.product.price,
    image: item.product.imageUrl ?? '',
    imageUrl: item.product.imageUrl ?? '',
    stock: item.product.stock,
    quantity: item.quantity,
  };
}

function normalizeCart(data) {
  const cart = data.cart ?? data;
  return (cart.items ?? []).map(normalizeCartItem);
}

export const cartApi = {
  getCart: async () => {
    const { data } = await axiosInstance.get('/cart');
    return { items: normalizeCart(data) };
  },

  // Merge guest items into the server cart
  mergeCart: async (guestItems) => {
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const items = (guestItems ?? [])
      .map((i) => ({
        productId: i?.id,
        quantity: Number(i?.quantity),
      }))
      .filter((i) => UUID_RE.test(String(i.productId)) && Number.isInteger(i.quantity) && i.quantity >= 1);

    const { data } = await axiosInstance.post('/cart/merge', { items });
    return { items: normalizeCart(data) };
  },

  // Add a single product to the server cart
  addItem: async (productId, quantity = 1) => {
    const { data } = await axiosInstance.post('/cart/items', { productId, quantity });
    return { items: normalizeCart(data) };
  },

  // Update quantity of a cart item by its CartItem.id
  updateItem: async (cartItemId, quantity) => {
    const { data } = await axiosInstance.patch(`/cart/items/${cartItemId}`, { quantity });
    return { items: normalizeCart(data) };
  },

  // Remove a cart item by its CartItem.id
  removeItem: async (cartItemId) => {
    const { data } = await axiosInstance.delete(`/cart/items/${cartItemId}`);
    return { items: normalizeCart(data) };
  },

  // Clear all items from the server cart
  clearCart: async () => {
    await axiosInstance.delete('/cart');
    return { ok: true };
  },

  // No-op kept for compat — per-item ops replace the sync pattern
  syncCart: async () => ({ ok: true }),
};
