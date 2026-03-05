import { algoliasearch } from 'algoliasearch';
import { env } from '../config/env';

function getClient() {
  if (!env.ALGOLIA_APP_ID || !env.ALGOLIA_ADMIN_KEY) return null;
  return algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY);
}

export function toAlgoliaObject(product: any) {
  return {
    objectID: product.id,
    name: product.name,
    description: product.description ?? '',
    category: product.category?.name ?? '',
    price: product.price,
    stock: product.stock ?? 0,
    imageUrl: product.imageUrl ?? '',
    storeName: product.store?.name ?? null,
  };
}

export const algoliaIndex = {
  async upsert(product: any) {
    const client = getClient();
    if (!client) return;
    try {
      await client.saveObject({ indexName: env.ALGOLIA_INDEX, body: toAlgoliaObject(product) });
    } catch (err: any) {
      console.warn('[Algolia] upsert failed:', err?.message);
    }
  },

  async delete(objectID: string) {
    const client = getClient();
    if (!client) return;
    try {
      await client.deleteObject({ indexName: env.ALGOLIA_INDEX, objectID });
    } catch (err: any) {
      console.warn('[Algolia] delete failed:', err?.message);
    }
  },

  async bulkUpsert(products: any[]) {
    const client = getClient();
    if (!client) return;
    try {
      await client.saveObjects({ indexName: env.ALGOLIA_INDEX, objects: products.map(toAlgoliaObject) });
    } catch (err: any) {
      console.warn('[Algolia] bulkUpsert failed:', err?.message);
    }
  },
};
