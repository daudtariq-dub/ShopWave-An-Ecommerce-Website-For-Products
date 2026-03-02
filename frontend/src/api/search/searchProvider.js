import { SEARCH_PROVIDERS, SEARCH_PROVIDER_KEY } from '../../utils/constants';
import { algoliaSearch } from './algolia.search';
import { elasticSearch } from './elastic.search';

const providers = {
  [SEARCH_PROVIDERS.ALGOLIA]: algoliaSearch,
  [SEARCH_PROVIDERS.ELASTIC]: elasticSearch,
};

export function getProvider(name) {
  return providers[name] ?? providers[SEARCH_PROVIDERS.ALGOLIA];
}

export function getSavedProvider() {
  const saved = localStorage.getItem(SEARCH_PROVIDER_KEY);
  return saved === SEARCH_PROVIDERS.ELASTIC ? SEARCH_PROVIDERS.ELASTIC : SEARCH_PROVIDERS.ALGOLIA;
}

export function saveProvider(name) {
  localStorage.setItem(SEARCH_PROVIDER_KEY, name);
}
