import { TOKEN_KEY, USER_KEY, GUEST_CART_KEY } from './constants';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};
export const setStoredUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

export const getGuestCart = () => {
  try {
    const c = localStorage.getItem(GUEST_CART_KEY);
    return c ? JSON.parse(c) : [];
  } catch { return []; }
};
export const setGuestCart = (items) =>
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
export const clearGuestCart = () => localStorage.removeItem(GUEST_CART_KEY);

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price ?? 0);

export const truncateText = (text, maxLength = 60) =>
  text?.length > maxLength ? `${text.slice(0, maxLength)}...` : (text ?? '');

export const slugify = (text) =>
  text?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ?? '';

export const buildQueryString = (params) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') qs.set(k, String(v));
  });
  return qs.toString();
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const isAdmin = (user) => user?.role === 'admin';
