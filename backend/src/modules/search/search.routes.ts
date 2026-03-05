import { Hono } from 'hono';
import { elasticSearchHandler, elasticSuggestHandler } from './search.controller';

export const searchRoutes = new Hono();

searchRoutes.get('/elastic', elasticSearchHandler);
searchRoutes.get('/elastic/suggest', elasticSuggestHandler);
