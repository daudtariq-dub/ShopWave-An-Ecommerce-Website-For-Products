import { useEffect, useState, useCallback } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/product/ProductGrid';
import Input from '../../components/ui/Input';

export default function Products() {
  const { products, loading, error, fetchProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = useCallback((e) => setSearch(e.target.value), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:w-auto w-full">
          <div className="w-full sm:w-64">
            <Input
              name="search"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-with-chevron px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 capitalize"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <ProductGrid products={filtered} loading={loading} error={error} />
    </div>
  );
}
