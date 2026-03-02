import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { ROUTES } from '../utils/constants';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  const navigate = useNavigate();
  const { login: ctxLogin, logout: ctxLogout, setError, setLoading, ...rest } = context;

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      ctxLogin(data.token, data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(payload);
      ctxLogin(data.token, data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.googleLogin(idToken);
      ctxLogin(data.token, data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Google login failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectTo = ROUTES.LOGIN) => {
    await ctxLogout();
    navigate(redirectTo, { replace: true });
  };

  const getCurrentUser = () => rest.user;

  return { ...rest, login, register, googleLogin, logout, getCurrentUser };
}
