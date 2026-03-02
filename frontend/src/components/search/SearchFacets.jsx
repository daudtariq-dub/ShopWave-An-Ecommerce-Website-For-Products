export default function SearchFacets({ facets = [], activeFilters = {}, onFilterChange }) {
  if (!facets.length) return null;

  return (
    <div className="flex flex-col gap-5">
      {facets.map((facet) => (
        <div key={facet.name}>
          <p className="text-sm font-medium text-gray-700 capitalize mb-2">
            {facet.name.replace('_', ' ')}
          </p>
          <div className="flex flex-col gap-1.5">
            {facet.values.slice(0, 8).map(({ label, count }) => {
              const active = Array.isArray(activeFilters[facet.name])
                ? activeFilters[facet.name].includes(label)
                : activeFilters[facet.name] === label;

              return (
                <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => {
                      const current = Array.isArray(activeFilters[facet.name])
                        ? activeFilters[facet.name]
                        : activeFilters[facet.name] ? [activeFilters[facet.name]] : [];
                      const next = e.target.checked
                        ? [...current, label]
                        : current.filter((v) => v !== label);
                      onFilterChange(facet.name, next.length ? next : null);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{label}</span>
                  <span className="text-xs text-gray-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
