/** Mock products API — swap this file for real axios calls once the backend is ready */
import { MOCK_PRODUCTS, MOCK_CATEGORIES, delay } from './mock';

let _products = [...MOCK_PRODUCTS]; // local mutable copy so admin edits are reflected

export const productsApi = {
  getAll: async (params = {}) => {
    await delay(350);
    let list = [..._products];

    if (params.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (params.sort === 'price_asc')  list.sort((a, b) => a.price - b.price);
    if (params.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (params.sort === 'rating')     list.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));

    const limit = params.limit ? Number(params.limit) : list.length;
    const page  = params.page  ? Number(params.page)  : 1;
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit);

    return { products: paged, total: list.length, page, limit };
  },

  getById: async (id) => {
    await delay(250);
    const product = _products.find((p) => String(p.id) === String(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  getByCategory: async (slug, params = {}) => {
    await delay(300);
    const filtered = slug === 'all'
      ? [..._products]
      : _products.filter((p) => p.category === slug);
    return { products: filtered, total: filtered.length };
  },

  getFeatured: async () => {
    await delay(300);
    const featured = [..._products].sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0)).slice(0, 8);
    return { products: featured, total: featured.length };
  },

  getCategories: async () => {
    await delay(200);
    return { categories: MOCK_CATEGORIES };
  },

  create: async (payload) => {
    await delay(500);
    const newProduct = { ...payload, id: Date.now(), rating: { rate: 0, count: 0 } };
    _products.push(newProduct);
    return newProduct;
  },

  update: async (id, payload) => {
    await delay(400);
    _products = _products.map((p) => String(p.id) === String(id) ? { ...p, ...payload } : p);
    return _products.find((p) => String(p.id) === String(id));
  },

  delete: async (id) => {
    await delay(300);
    _products = _products.filter((p) => String(p.id) !== String(id));
    return { ok: true };
  },

  /** Presigned URL mock — returns a fake URL; real upload won't happen */
  getUploadUrl: async (filename, _contentType) => {
    await delay(200);
    return { uploadUrl: '#', publicUrl: `https://placehold.co/400x400/eef2ff/4f46e5?text=${encodeURIComponent(filename)}` };
  },
};
