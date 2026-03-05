import { Hono } from 'hono';
import { getCategories } from './categories.controller';

export const categoriesRoutes = new Hono();

categoriesRoutes.get('/', getCategories);
