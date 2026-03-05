import type { Context } from 'hono';
import { elasticClient } from '../../lib/elastic';
import { env } from '../../config/env';

const INDEX = env.ELASTIC_INDEX;

// GET /search/elastic
export const elasticSearchHandler = async (c: Context) => {
  const { q = '', page = '0', size = '20', category, minPrice, maxPrice } = c.req.query();

  const from = parseInt(page, 10) * parseInt(size, 10);
  const must: object[] = [];
  const filter: object[] = [];

  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'title^3', 'description', 'category'],
        fuzziness: 'AUTO',
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (category) filter.push({ term: { 'category.keyword': category } });
  if (minPrice || maxPrice) {
    const range: Record<string, number> = {};
    if (minPrice) range.gte = parseFloat(minPrice);
    if (maxPrice) range.lte = parseFloat(maxPrice);
    filter.push({ range: { price: range } });
  }

  try {
    const response = await elasticClient.search({
      index: INDEX,
      from,
      size: parseInt(size, 10),
      query: { bool: { must, filter } },
      highlight: {
        fields: { name: {}, title: {}, description: {} },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
      aggs: {
        category: { terms: { field: 'category.keyword', size: 20 } },
      },
    });

    return c.json({
      hits: response.hits,
      aggregations: response.aggregations,
      total: response.hits.total,
      page: parseInt(page, 10),
      hitsPerPage: parseInt(size, 10),
    });
  } catch (err: any) {
    console.warn('[Elastic] Search failed:', err?.message ?? err);
    return c.json({
      hits: { hits: [], total: { value: 0 } },
      aggregations: {},
      total: { value: 0 },
      page: parseInt(page, 10),
      hitsPerPage: parseInt(size, 10),
    });
  }
};

// GET /search/elastic/suggest
export const elasticSuggestHandler = async (c: Context) => {
  const { q = '', size = '5' } = c.req.query();

  if (!q) return c.json([]);

  try {
    const response = await elasticClient.search({
      index: INDEX,
      size: parseInt(size, 10),
      query: {
        multi_match: {
          query: q,
          fields: ['name^3', 'title^3'],
          fuzziness: 'AUTO',
        },
      },
      _source: ['name', 'title'],
    });

    const suggestions = response.hits.hits.map((hit: any) => {
      const src = hit._source as any;
      return src.name ?? src.title ?? '';
    }).filter(Boolean);

    return c.json(suggestions);
  } catch (err: any) {
    console.warn('[Elastic] Suggest failed:', err?.message ?? err);
    return c.json([]);
  }
};
