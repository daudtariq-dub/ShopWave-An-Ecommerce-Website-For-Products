import axiosInstance from '../axios';
import { normalizeElasticResults, EMPTY_RESULTS } from '../../utils/searchAdapter';

const PROXY = import.meta.env.VITE_ELASTIC_PROXY_PATH ?? '/search/elastic';

export const elasticSearch = {
  name: 'Elasticsearch',

  async search({ query = '', filters = {}, page = 0, hitsPerPage = 20 }) {
    try {
      const params = {
        q: query,
        page,
        size: hitsPerPage,
        ...filters,
      };
      const { data } = await axiosInstance.get(PROXY, { params });
      return normalizeElasticResults(data);
    } catch (err) {
      console.warn('[Elastic] Search failed:', err.message);
      return EMPTY_RESULTS;
    }
  },

  async getSuggestions(partialQuery) {
    if (!partialQuery) return [];
    try {
      const { data } = await axiosInstance.get(`${PROXY}/suggest`, {
        params: { q: partialQuery, size: 5 },
      });
      return Array.isArray(data) ? data : data.suggestions ?? [];
    } catch {
      return [];
    }
  },
};
