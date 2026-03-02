import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useFilters } from '../../hooks/useFilters';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import ProductSort from '../../components/product/ProductSort';
import ProductBreadcrumb from '../../components/product/ProductBreadcrumb';
import Pagination from '../../components/ui/extended/Pagination';
import Drawer from '../../components/ui/extended/Drawer';
import Button from '../../components/ui/Button';

export default function CategoryListing() {
  const { slug } = useParams();
  const { products, loading, error, total, fetchByCategory, fetchProducts } = useProducts();
  const { filters, setFilter, clearFilters, activeFilterCount, page, sort } = useFilters();
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  const isAll = !slug || slug === 'all';
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const params = { page, limit: pageSize, sort, ...filters };
    if (isAll) {
      fetchProducts(params);
    } else {
      fetchByCategory(slug, params);
    }
  }, [slug, page, sort, JSON.stringify(filters)]); // eslint-disable-line

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: isAll ? 'All Products' : slug.charAt(0).toUpperCase() + slug.slice(1) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <ProductBreadcrumb crumbs={crumbs} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersDrawerOpen(true)}
          className="lg:hidden"
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAll ? 'All Products' : slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{total} product{total !== 1 ? 's' : ''}</p>
          )}
        </div>
        <ProductSort value={sort} onChange={(v) => setFilter('sort', v)} />
      </div>

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilter}
            onClearFilters={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <ProductGrid products={products} loading={loading} error={error} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setFilter('page', p > 0 ? p : null)}
          />
        </div>
      </div>

      {/* Mobile filters drawer */}
      <Drawer
        open={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        title="Filters"
        side="left"
        width="w-72"
      >
        <div className="p-5">
          <ProductFilters
            filters={filters}
            onFilterChange={(k, v) => { setFilter(k, v); }}
            onClearFilters={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>
      </Drawer>
    </div>
  );
}
