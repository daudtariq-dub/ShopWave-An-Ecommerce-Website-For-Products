import { algoliasearch } from 'algoliasearch';
import { normalizeAlgoliaResults, EMPTY_RESULTS } from '../../utils/searchAdapter';

const APP_ID = (import.meta.env.VITE_ALGOLIA_APP_ID ?? '').trim();
const SEARCH_KEY = (import.meta.env.VITE_ALGOLIA_SEARCH_KEY ?? '').trim();
const INDEX_NAME = (import.meta.env.VITE_ALGOLIA_INDEX ?? 'products').trim();

let client = null;

function getClient() {
  if (!APP_ID || !SEARCH_KEY) return null;
  if (!client) client = algoliasearch(APP_ID, SEARCH_KEY);
  return client;
}

export const algoliaSearch = {
  name: 'Algolia',

  async search({ query = '', filters = {}, page = 0, hitsPerPage = 20 }) {
    const c = getClient();
    if (!c) {
      console.warn('[Algolia] Missing credentials — returning empty results.');
      return EMPTY_RESULTS;
    }

    const facetFilters = buildFacetFilters(filters);
    const numericFilters = buildNumericFilters(filters);

    // algoliasearch v5 uses client.search({ requests }) API
    try {
      const { results } = await c.search({
        requests: [
          {
            indexName: INDEX_NAME,
            query,
            page,
            hitsPerPage,
            facets: ['category', 'brand', 'rating'],
            facetFilters: facetFilters.length ? facetFilters : undefined,
            numericFilters: numericFilters.length ? numericFilters : undefined,
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
          },
        ],
      });
      return normalizeAlgoliaResults(results[0] ?? { hits: [], nbHits: 0 });
    } catch (err) {
      console.warn('[Algolia] Search failed:', err?.message ?? err);
      return EMPTY_RESULTS;
    }
  },

  async getSuggestions(partialQuery) {
    const c = getClient();
    if (!c || !partialQuery) return [];
    try {
      const { results } = await c.search({
        requests: [
          {
            indexName: INDEX_NAME,
            query: partialQuery,
            hitsPerPage: 5,
            attributesToRetrieve: ['title', 'name'],
          },
        ],
      });
      return (results[0]?.hits ?? []).map((h) => h.title ?? h.name ?? '');
    } catch (err) {
      console.warn('[Algolia] Suggest failed:', err?.message ?? err);
      return [];
    }
  },
};

function buildFacetFilters(filters) {
  const facetFilters = [];
  if (filters.category) facetFilters.push(`category:${filters.category}`);
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    brands.forEach((b) => facetFilters.push(`brand:${b}`));
  }
  return facetFilters;
}

function buildNumericFilters(filters) {
  const numeric = [];
  if (filters.minPrice != null) numeric.push(`price >= ${filters.minPrice}`);
  if (filters.maxPrice != null) numeric.push(`price <= ${filters.maxPrice}`);
  if (filters.minRating != null) numeric.push(`rating.rate >= ${filters.minRating}`);
  return numeric;
}
