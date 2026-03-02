/** Mock auth API — swap this file for real axios calls once the backend is ready */
import { delay } from './mock';

export const authApi = {
  login: async ({ email, password }) => {
    await delay(500);
    if (!email || !password) throw new Error('Email and password are required.');
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      token: 'mock-jwt-' + Date.now(),
      user: { id: 'u1', email, name, role: 'admin' },
    };
  },

  register: async ({ name, email, password }) => {
    await delay(600);
    if (!name || !email || !password) throw new Error('All fields are required.');
    return {
      token: 'mock-jwt-' + Date.now(),
      user: { id: 'u1', email, name, role: 'user' },
    };
  },

  googleLogin: async (_credential) => {
    await delay(400);
    return {
      token: 'mock-jwt-google-' + Date.now(),
      user: { id: 'u2', email: 'google@example.com', name: 'Google User', role: 'user' },
    };
  },

  /** Restores session from localStorage — no network call needed in mock mode */
  me: async () => {
    await delay(50);
    const raw = localStorage.getItem('auth_user');
    if (!raw) throw new Error('No session');
    return JSON.parse(raw);
  },

  logout: async () => {
    await delay(150);
    return { ok: true };
  },

  updateProfile: async (data) => {
    await delay(400);
    return data;
  },
};
