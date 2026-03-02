import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import {
  getStoredUser, setStoredUser, removeStoredUser,
  getToken, setToken, removeToken,
} from '../utils/helpers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // true until initial validation done
  const [error, setError] = useState(null);

  // Validate stored token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then((userData) => {
        setUser(userData);
        setStoredUser(userData);
        setIsAuthenticated(true);
      })
      .catch(() => {
        removeToken();
        removeStoredUser();
      })
      .finally(() => setLoading(false));
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
