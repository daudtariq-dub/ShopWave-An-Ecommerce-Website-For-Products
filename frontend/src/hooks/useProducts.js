import { useState, useCallback } from 'react';
import { productsApi } from '../api/products.api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll(params);
      const list = data.products ?? data ?? [];
      setProducts(list);
      setTotal(data.total ?? data.pagination?.total ?? list.length);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch products.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAdminAll(params);
      const list = data.products ?? data ?? [];
      setProducts(list);
      setTotal(data.total ?? data.pagination?.total ?? list.length);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch products.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getById(id);
      setProduct(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch product.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(async (slug, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getByCategory(slug, params);
      const list = data.products ?? data ?? [];
      setProducts(list);
      setTotal(data.total ?? data.pagination?.total ?? list.length);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch products.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getFeatured();
      const list = data.products ?? data ?? [];
      setProducts(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to fetch featured products.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await productsApi.getCategories();
      setCategories(data.categories ?? data ?? []);
      return data;
    } catch { return []; }
  }, []);

  return {
    products, product, categories, total,
    loading, error,
    fetchProducts, fetchAdminProducts, fetchProductById, fetchByCategory, fetchFeatured, fetchCategories,
  };
}
