import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { ensureIndex, elasticIndex } from '../lib/elasticIndex';
import { algoliaIndex } from '../lib/algolia';

async function main() {
  console.log('Fetching all products from database...');
  const products = await prisma.product.findMany({
    include: { category: true, store: true },
  });
  console.log(`Found ${products.length} products.`);

  console.log('Creating Elasticsearch index (if needed)...');
  await ensureIndex();

  console.log('Indexing into Elasticsearch...');
  await elasticIndex.bulkUpsert(products);
  console.log('Elasticsearch done.');

  console.log('Indexing into Algolia...');
  await algoliaIndex.bulkUpsert(products);
  console.log('Algolia done.');

  console.log('Sync complete.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
