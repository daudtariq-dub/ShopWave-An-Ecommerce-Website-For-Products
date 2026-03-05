import { Hono } from 'hono';
import type { AppVariables } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { getProductReviews, upsertReview, deleteReview } from './reviews.controller';

const reviewsRoutes = new Hono<{ Variables: AppVariables }>();

reviewsRoutes.get('/:productId', getProductReviews);
reviewsRoutes.post('/:productId', authMiddleware, upsertReview);
reviewsRoutes.delete('/:productId/:reviewId', authMiddleware, deleteReview);

export { reviewsRoutes };
