import { Star } from 'lucide-react';
import RangeSlider from '../ui/extended/RangeSlider';

const RATINGS = [4, 3, 2, 1];

export default function ProductFilters({ filters, onFilterChange, onClearFilters, facets = [], activeCount = 0 }) {
  const brandFacet = facets.find((f) => f.name === 'brand');

  const minPrice = Number(filters.minPrice ?? 0);
  const maxPrice = Number(filters.maxPrice ?? 1000);
  const inStockOnly = filters.inStock === 'true';
  const selectedBrands = Array.isArray(filters.brand)
    ? filters.brand
    : filters.brand ? [filters.brand] : [];
  const minRating = Number(filters.minRating ?? 0);

  const toggleBrand = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    onFilterChange('brand', next.length ? next : null);
  };

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {activeCount > 0 && (
          <button onClick={onClearFilters} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Price Range</p>
        <RangeSlider
          min={0} max={1000} step={5}
          value={[minPrice, maxPrice]}
          onChange={([lo, hi]) => {
            onFilterChange('minPrice', lo > 0 ? lo : null);
            onFilterChange('maxPrice', hi < 1000 ? hi : null);
          }}
        />
      </div>

      {/* Availability */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Availability</p>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : null)}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</p>
        <div className="flex flex-col gap-2">
          {RATINGS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => onFilterChange('minRating', r)}
                className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-sm text-gray-700">
                {Array.from({ length: r }).map((_, i) => (
                  <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" strokeWidth={1.5} />
                ))}
                <span>& up</span>
              </span>
            </label>
          ))}
          {minRating > 0 && (
            <button onClick={() => onFilterChange('minRating', null)} className="text-xs text-indigo-600 text-left">
              Clear rating
            </button>
          )}
        </div>
      </div>

      {/* Brand */}
      {brandFacet?.values?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Brand</p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {brandFacet.values.map(({ label, count }) => (
              <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(label)}
                  onChange={() => toggleBrand(label)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <span className="text-xs text-gray-400">({count})</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
