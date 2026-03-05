import { elasticClient } from './elastic';
import { env } from '../config/env';

const INDEX = env.ELASTIC_INDEX;

const MAPPING = {
  properties: {
    name:        { type: 'text', fields: { keyword: { type: 'keyword' } } },
    description: { type: 'text' },
    category:    { type: 'text', fields: { keyword: { type: 'keyword' } } },
    price:       { type: 'float' },
    stock:       { type: 'integer' },
    imageUrl:    { type: 'keyword', index: false },
    storeName:   { type: 'keyword' },
  },
} as const;

export async function ensureIndex() {
  try {
    const exists = await elasticClient.indices.exists({ index: INDEX });
    if (!exists) {
      await elasticClient.indices.create({ index: INDEX, mappings: MAPPING });
      console.log(`[Elastic] Created index "${INDEX}"`);
    }
  } catch (err: any) {
    console.warn('[Elastic] ensureIndex failed:', err?.message);
  }
}

export function toElasticDoc(product: any) {
  return {
    name: product.name,
    description: product.description ?? '',
    category: product.category?.name ?? '',
    price: product.price,
    stock: product.stock ?? 0,
    imageUrl: product.imageUrl ?? '',
    storeName: product.store?.name ?? null,
  };
}

export const elasticIndex = {
  async upsert(product: any) {
    try {
      await elasticClient.index({ index: INDEX, id: product.id, document: toElasticDoc(product) });
    } catch (err: any) {
      console.warn('[Elastic] upsert failed:', err?.message);
    }
  },

  async delete(id: string) {
    try {
      await elasticClient.delete({ index: INDEX, id });
    } catch (err: any) {
      console.warn('[Elastic] delete failed:', err?.message);
    }
  },

  async bulkUpsert(products: any[]) {
    if (!products.length) return;
    try {
      const operations = products.flatMap((p) => [
        { index: { _index: INDEX, _id: p.id } },
        toElasticDoc(p),
      ]);
      await elasticClient.bulk({ operations, refresh: true });
    } catch (err: any) {
      console.warn('[Elastic] bulkUpsert failed:', err?.message);
    }
  },
};
