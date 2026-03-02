import { useSearch } from '../../hooks/useSearch';
import { SEARCH_PROVIDERS } from '../../utils/constants';

export default function SearchProviderToggle() {
  const { provider, setProvider, query, filters, page, search } = useSearch();

  const handleSwitch = (next) => {
    setProvider(next);
    // Re-run current search with the new provider
    if (query) {
      // Small delay to let state settle
      setTimeout(() => search(query, filters, page), 50);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Search via:</span>
      <div className="flex rounded-xl border border-gray-200 overflow-hidden">
        {Object.values(SEARCH_PROVIDERS).map((p) => (
          <button
            key={p}
            onClick={() => handleSwitch(p)}
            className={[
              'px-3 py-1.5 text-xs font-medium transition-colors capitalize',
              provider === p
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            {p === SEARCH_PROVIDERS.ALGOLIA ? 'Algolia' : 'Elasticsearch'}
          </button>
        ))}
      </div>
    </div>
  );
}
