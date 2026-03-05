export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';
export const GUEST_CART_KEY = 'guest_cart';
export const SEARCH_PROVIDER_KEY = 'search_provider';
export const SIDEBAR_KEY = 'sidebar_collapsed';

export const ROUTES = {
  // Consumer
  HOME: '/',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',
  PRODUCT: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation/:id',
  ORDERS: '/account/orders',
  PROFILE: '/account/profile',
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  OAUTH_CALLBACK: '/auth/callback',
  // Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: '/admin/users/:id',
  ADMIN_PROFILE: '/admin/profile',
  // Super Admin
  SUPER_ADMIN: '/super-admin',
  SUPER_ADMIN_STORES: '/super-admin/stores',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_CATEGORIES: '/super-admin/categories',
};

export const STOCK_THRESHOLDS = {
  LOW: 5,
  OUT: 0,
};

export const SEARCH_PROVIDERS = {
  ALGOLIA: 'algolia',
  ELASTIC: 'elastic',
};

export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating_desc' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: { label: 'Pending', color: 'amber' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'indigo' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};
