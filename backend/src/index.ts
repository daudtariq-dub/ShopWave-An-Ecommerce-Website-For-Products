import 'dotenv/config'; // Must be first — loads .env before any module (including Prisma) initialises
import { serve } from '@hono/node-server';
import app from './app';
import { env } from './config/env';
import { ensureIndex } from './lib/elasticIndex';

serve({ fetch: app.fetch, port: env.PORT }, () => {
  console.log(`Server running → http://localhost:${env.PORT}`);
  console.log(`Health check  → http://localhost:${env.PORT}/health`);
  ensureIndex(); // create ES index if it doesn't exist yet
});
