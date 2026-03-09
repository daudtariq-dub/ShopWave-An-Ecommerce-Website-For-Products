import { useContext, useCallback, useRef } from 'react';
import { SearchContext } from '../context/SearchContext';
import { debounce } from '../utils/helpers';

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');

  const { search } = context;

  // Always-fresh ref so the debounced function never closes over a stale search
  const searchRef = useRef(search);
  searchRef.current = search;

  const debouncedSearchRef = useRef(
    debounce((q, filters, page) => searchRef.current(q, filters, page), 350)
  );

  const debouncedSearch = useCallback((q, filters, page) => {
    debouncedSearchRef.current(q, filters, page);
  }, []);

  return { ...context, debouncedSearch };
}
