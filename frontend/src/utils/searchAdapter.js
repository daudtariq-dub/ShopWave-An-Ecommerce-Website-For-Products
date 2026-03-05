/**
 * Normalizes both Algolia and Elasticsearch responses into a consistent shape.
 * All consumers work with NormalizedHit[], never raw provider responses.
 */

export function normalizeAlgoliaResults(algoliaResponse) {
  const hits = algoliaResponse.hits ?? [];
  return {
    hits: hits.map((hit) => ({
      id: hit.objectID ?? hit.id,
      title: hit.title ?? hit.name ?? '',
      price: hit.price ?? 0,
      category: hit.category ?? '',
      image: hit.image ?? hit.imageUrl ?? hit.images?.[0] ?? null,
      stock: hit.stock ?? hit.stockQuantity ?? null,
      rating: hit.rating ?? null,
      description: hit.description ?? '',
      _highlight: {
        title: hit._highlightResult?.title?.value ?? hit.title ?? hit.name ?? '',
        description: hit._highlightResult?.description?.value ?? hit.description ?? '',
      },
    })),
    total: algoliaResponse.nbHits ?? hits.length,
    page: algoliaResponse.page ?? 0,
    totalPages: algoliaResponse.nbPages ?? 1,
    facets: normalizeAlgoliaFacets(algoliaResponse.facets ?? {}),
  };
}

function normalizeAlgoliaFacets(rawFacets) {
  return Object.entries(rawFacets).map(([name, values]) => ({
    name,
    values: Object.entries(values).map(([label, count]) => ({ label, count })),
  }));
}

export function normalizeElasticResults(elasticResponse) {
  const hits = elasticResponse.hits?.hits ?? elasticResponse.results ?? [];
  const total =
    elasticResponse.hits?.total?.value ??
    elasticResponse.total ??
    hits.length;

  return {
    hits: hits.map((hit) => {
      const src = hit._source ?? hit;
      const highlight = hit.highlight ?? {};
      return {
        id: hit._id ?? src.id,
        title: src.title ?? src.name ?? '',
        price: src.price ?? 0,
        category: src.category ?? '',
        image: src.image ?? src.imageUrl ?? src.images?.[0] ?? null,
        stock: src.stock ?? src.stockQuantity ?? null,
        rating: src.rating ?? null,
        description: src.description ?? '',
        _highlight: {
          title: highlight.title?.[0] ?? src.title ?? src.name ?? '',
          description: highlight.description?.[0] ?? src.description ?? '',
        },
      };
    }),
    total,
    page: elasticResponse.page ?? 0,
    totalPages: Math.ceil(total / (elasticResponse.hitsPerPage ?? 20)),
    facets: normalizeElasticFacets(elasticResponse.aggregations ?? elasticResponse.facets ?? {}),
  };
}

function normalizeElasticFacets(aggregations) {
  return Object.entries(aggregations).map(([name, agg]) => ({
    name,
    values: (agg.buckets ?? []).map((b) => ({ label: b.key, count: b.doc_count ?? 0 })),
  }));
}

export const EMPTY_RESULTS = {
  hits: [],
  total: 0,
  page: 0,
  totalPages: 0,
  facets: [],
};
