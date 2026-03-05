import axiosInstance from './axios';

export const reviewsApi = {
  getByProduct: async (productId, { page = 0, limit = 10 } = {}) => {
    const { data } = await axiosInstance.get(`/reviews/${productId}`, { params: { page, limit } });
    return data; // { reviews, total, page, totalPages, averageRating, ratingCount }
  },

  upsert: async (productId, { rating, title, body }) => {
    const { data } = await axiosInstance.post(`/reviews/${productId}`, { rating, title, body });
    return data.review;
  },

  delete: async (productId, reviewId) => {
    await axiosInstance.delete(`/reviews/${productId}/${reviewId}`);
  },
};
