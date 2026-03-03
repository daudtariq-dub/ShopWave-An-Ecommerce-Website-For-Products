/** Mock auth API — swap this file for real axios calls once the backend is ready */
import { delay } from './mock';

export const MOCK_USERS = {
  admin: {
    email: 'admin@shopwave.com',
    password: 'admin123',
    user: { id: 'u-admin-1', email: 'admin@shopwave.com', name: 'Admin User', role: 'admin' },
  },
  consumer: {
    email: 'user@shopwave.com',
    password: 'user1234',
    user: { id: 'u-consumer-1', email: 'user@shopwave.com', name: 'Consumer User', role: 'user' },
  },
};

export const authApi = {
  login: async ({ email, password }) => {
    await delay(500);
    if (!email || !password) throw new Error('Email and password are required.');
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === MOCK_USERS.admin.email && password === MOCK_USERS.admin.password) {
      return {
        token: 'mock-jwt-admin-' + Date.now(),
        user: MOCK_USERS.admin.user,
      };
    }

    if (normalizedEmail === MOCK_USERS.consumer.email && password === MOCK_USERS.consumer.password) {
      return {
        token: 'mock-jwt-user-' + Date.now(),
        user: MOCK_USERS.consumer.user,
      };
    }

    throw new Error('Invalid credentials. Use the provided demo admin or consumer account.');
  },

  register: async ({ name, email, password }) => {
    await delay(600);
    if (!name || !email || !password) throw new Error('All fields are required.');
    return {
      token: 'mock-jwt-' + Date.now(),
      user: { id: 'u1', email, name, role: 'user' },
    };
  },

  googleLogin: async () => {
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
