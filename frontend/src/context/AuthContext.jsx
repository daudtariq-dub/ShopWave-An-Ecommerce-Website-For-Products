import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';
import { STORAGE_KEYS } from '../utils/constants';

const DEMO_USERS = {
  user: {
    email: 'demo@shopper.com',
    password: 'demo123',
    payload: {
      id: 'demo-user',
      name: 'Demo Shopper',
      email: 'demo@shopper.com',
      role: 'user',
    },
  },
  admin: {
    email: 'admin@shopper.com',
    password: 'admin123',
    payload: {
      id: 'demo-admin',
      name: 'Demo Admin',
      email: 'admin@shopper.com',
      role: 'admin',
    },
  },
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const demoMatch = Object.values(DEMO_USERS).find(
      (demo) =>
        demo.email === credentials.email && demo.password === credentials.password,
    );

    if (demoMatch) {
      const fakeToken = `demo-token-${demoMatch.payload.role}`;
      const nextUser = demoMatch.payload;

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, fakeToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(nextUser));
      setToken(fakeToken);
      setUser(nextUser);

      return { token: fakeToken, user: nextUser };
    }

    const error = new Error('Invalid demo credentials');
    error.response = { data: { message: 'Invalid email or password' } };
    throw error;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors to avoid blocking user
    }

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setUser(null);
    setToken(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    if (data?.user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
      setUser(data.user);
    }
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      getCurrentUser,
    }),
    [user, token, loading, login, logout, getCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

