import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const ARRAY_KEYS = ['brand'];

function parseParams(searchParams) {
  const result = {};
  for (const [key, value] of searchParams.entries()) {
    if (ARRAY_KEYS.includes(key)) {
      result[key] = result[key] ? [...result[key], value] : [value];
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseParams(searchParams);

  const setFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === undefined || value === '') {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.delete(key);
        value.forEach((v) => next.append(key, v));
      } else {
        next.set(key, String(value));
      }
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const setFilters = useCallback((newFilters) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([k, v]) => {
        next.delete(k);
        if (v !== null && v !== undefined && v !== '') {
          if (Array.isArray(v)) v.forEach((val) => next.append(k, val));
          else next.set(k, String(v));
        }
      });
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => setSearchParams({}), [setSearchParams]);

  const setPage = useCallback((page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page <= 0) next.delete('page');
      else next.set('page', String(page));
      return next;
    });
  }, [setSearchParams]);

  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== 'page' && k !== 'sort' && filters[k]
  ).length;

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    setPage,
    activeFilterCount,
    page: Number(filters.page ?? 0),
    sort: filters.sort ?? 'relevance',
  };
}
