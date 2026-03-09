import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import {
  getStoredUser, setStoredUser, removeStoredUser,
  getToken, setToken, removeToken,
} from '../utils/helpers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize immediately from localStorage — no loading flash
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken() && !!getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Silently validate stored token in background; refresh user data or clear if expired
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    authApi.me()
      .then((userData) => {
        setUser(userData);
        setStoredUser(userData);
        setIsAuthenticated(true);
      })
      .catch(() => {
        removeToken();
        removeStoredUser();
        setUser(null);
        setIsAuthenticated(false);
      });
  }, []);

  const login = useCallback((token, userData) => {
    setToken(token);
    setStoredUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    removeToken();
    removeStoredUser();
    setUser(null);
    setIsAuthenticated(false);
  }, []);


  const updateUser = useCallback((userData) => {
    setUser(userData);
    setStoredUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, login, logout, updateUser, setError, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
