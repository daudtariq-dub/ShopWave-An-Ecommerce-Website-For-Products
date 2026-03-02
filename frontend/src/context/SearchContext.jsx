import { createContext, useState, useCallback, useRef } from 'react';
import { getProvider, getSavedProvider, saveProvider } from '../api/search/searchProvider';
import { EMPTY_RESULTS } from '../utils/searchAdapter';
import { SEARCH_PROVIDERS } from '../utils/constants';

export const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [provider, setProviderState] = useState(getSavedProvider);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const abortRef = useRef(null);

  const setProvider = useCallback((name) => {
    if (!Object.values(SEARCH_PROVIDERS).includes(name)) return;
    saveProvider(name);
    setProviderState(name);
  }, []);

  const search = useCallback(async (searchQuery, searchFilters = {}, searchPage = 0) => {
    if (abortRef.current) abortRef.current.cancelled = true;
    const token = { cancelled: false };
    abortRef.current = token;

    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    setFilters(searchFilters);
    setPage(searchPage);

    try {
      const providerImpl = getProvider(provider);
      const data = await providerImpl.search({
        query: searchQuery,
        filters: searchFilters,
        page: searchPage,
        hitsPerPage: 20,
      });
      if (!token.cancelled) setResults(data);
    } catch (err) {
      if (!token.cancelled) setError(err.message ?? 'Search failed.');
    } finally {
      if (!token.cancelled) setLoading(false);
    }
  }, [provider]);

  const getSuggestions = useCallback(async (partial) => {
    if (!partial) return [];
    try {
      return await getProvider(provider).getSuggestions(partial);
    } catch { return []; }
  }, [provider]);

  const clearResults = useCallback(() => {
    setResults(EMPTY_RESULTS);
    setQuery('');
    setFilters({});
    setPage(0);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        provider, setProvider,
        query, filters, page, setPage,
        results, loading, error,
        search, getSuggestions, clearResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
