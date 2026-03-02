import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { useFilters } from '../../hooks/useFilters';
import SearchResultCard from '../../components/search/SearchResultCard';
import SearchProviderToggle from '../../components/search/SearchProviderToggle';
import SearchFacets from '../../components/search/SearchFacets';
import ProductSort from '../../components/product/ProductSort';
import Pagination from '../../components/ui/extended/Pagination';
import Loader from '../../components/ui/Loader';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const { results, loading, error, search } = useSearch();
  const { filters, setFilter, clearFilters, activeFilterCount, page, sort } = useFilters();

  useEffect(() => {
    if (q) search(q, { ...filters, sort }, page);
  }, [q, page, sort, JSON.stringify(filters)]); // eslint-disable-line

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : 'Search Products'}
          </h1>
          {!loading && results.total > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{results.total} results found</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <SearchProviderToggle />
          <ProductSort value={sort} onChange={(v) => setFilter('sort', v)} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Facets */}
        {results.facets?.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <SearchFacets
              facets={results.facets}
              activeFilters={filters}
              onFilterChange={setFilter}
            />
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {loading && <Loader text="Searching..." />}

          {!loading && error && (
            <div className="py-12 text-center">
              <p className="text-gray-500">{error}</p>
            </div>
          )}

          {!loading && !error && q && results.hits.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-medium">No results for "{q}"</h3>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or remove filters.</p>
            </div>
          )}

          {!loading && results.hits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.hits.map((hit) => (
                <SearchResultCard key={hit.id} hit={hit} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={results.totalPages}
            onPageChange={(p) => setFilter('page', p > 0 ? p : null)}
          />
        </div>
      </div>
    </div>
  );
}
