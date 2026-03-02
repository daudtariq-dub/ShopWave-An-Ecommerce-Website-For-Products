/** Mock inventory API — derives inventory from the mock products list */
import { MOCK_PRODUCTS, delay } from './mock';

// In-memory inventory so updates persist for the session
let _inventory = MOCK_PRODUCTS.map((p) => ({
  productId: p.id,
  id: p.id,
  title: p.title,
  category: p.category,
  price: p.price,
  stock: p.stock ?? 0,
}));

export const inventoryApi = {
  getAll: async () => {
    await delay(400);
    return { inventory: _inventory };
  },

  update: async (productId, stock) => {
    await delay(350);
    _inventory = _inventory.map((item) =>
      String(item.productId) === String(productId) || String(item.id) === String(productId)
        ? { ...item, stock }
        : item
    );
    return { ok: true };
  },

  bulkUpdate: async (updates) => {
    await delay(500);
    updates.forEach(({ productId, stock }) => {
      _inventory = _inventory.map((item) =>
        String(item.productId) === String(productId) ? { ...item, stock } : item
      );
    });
    return { ok: true };
  },
};
