import axiosInstance from './axios';

// Maps backend product shape → frontend shape
export function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.name,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.imageUrl || null,
    imageUrl: p.imageUrl || null,
    category: p.category?.name ?? p.category ?? '',
    categoryId: p.category?.id ?? p.categoryId ?? '',
    stock: p.stock ?? 0,
    rating: p.rating?.rate != null ? p.rating : null,
    store: p.store ?? null,
    storeName: p.store?.name ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export const productsApi = {
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/products', {
      params: {
        page: (params.page ?? 0) + 1, // frontend is 0-indexed, backend is 1-indexed
        limit: params.limit ?? 12,
        category: params.category && params.category !== 'all' ? params.category : undefined,
        search: params.q ?? params.search,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      },
    });
    const products = (data.products ?? []).map(normalizeProduct);
    return {
      products,
      total: data.pagination?.total ?? products.length,
      page: data.pagination?.page ?? 1,
      limit: data.pagination?.limit ?? products.length,
      totalPages: data.pagination?.totalPages ?? 1,
    };
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return normalizeProduct(data.product);
  },

  getByCategory: async (slug, params = {}) => {
    const { data } = await axiosInstance.get('/products', {
      params: { category: slug !== 'all' ? slug : undefined, page: params.page ?? 1, limit: params.limit ?? 12 },
    });
    const products = (data.products ?? []).map(normalizeProduct);
    return { products, total: data.pagination?.total ?? products.length };
  },

  getFeatured: async () => {
    const { data } = await axiosInstance.get('/products', { params: { limit: 8 } });
    const products = (data.products ?? []).map(normalizeProduct);
    return { products, total: products.length };
  },

  getCategories: async () => {
    const { data } = await axiosInstance.get('/categories');
    const categories = (data.categories ?? []).map((c) =>
      typeof c === 'string' ? { id: c, name: c } : c,
    );
    return { categories };
  },

  getAdminAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/products', {
      params: {
        page: (params.page ?? 0) + 1,
        limit: params.limit ?? 20,
        category: params.category && params.category !== 'all' ? params.category : undefined,
        search: params.q ?? params.search,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      },
    });
    const products = (data.products ?? []).map(normalizeProduct);
    return {
      products,
      total: data.pagination?.total ?? products.length,
      page: data.pagination?.page ?? 1,
      limit: data.pagination?.limit ?? products.length,
      totalPages: data.pagination?.totalPages ?? 1,
    };
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post('/admin/products', payload);
    return normalizeProduct(data.product);
  },

  update: async (id, payload) => {
    const { data } = await axiosInstance.patch(`/admin/products/${id}`, payload);
    return normalizeProduct(data.product);
  },

  delete: async (id) => {
    await axiosInstance.delete(`/admin/products/${id}`);
    return { ok: true };
  },

  getUploadUrl: async (filename, contentType) => {
    const { data } = await axiosInstance.get('/admin/products/upload-url', {
      params: { filename, contentType },
    });
    return data; // { uploadUrl, publicUrl }
  },
};
