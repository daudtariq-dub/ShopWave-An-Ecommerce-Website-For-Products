import { Client } from '@elastic/elasticsearch';
import { env } from '../config/env';

export const elasticClient = new Client({
  node: env.ELASTIC_NODE,
  auth: {
    apiKey: env.ELASTIC_API_KEY,
  },
});
