import { Hono } from 'hono';
import { getProducts, getProductById } from './products.controller';

export const productsRoutes = new Hono();

productsRoutes.get('/', getProducts);
productsRoutes.get('/:id', getProductById);
