import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { isAdmin, isSuperAdmin } from '../../utils/helpers';
import Loader from '../ui/Loader';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (isSuperAdmin(user)) {
    return <Navigate to="/super-admin" replace />;
  }
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function SuperAdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (!isSuperAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function ConsumerRoute({ children }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <Loader fullScreen />;
  if (isAuthenticated && isSuperAdmin(user)) {
    return <Navigate to="/super-admin" replace />;
  }
  if (isAuthenticated && isAdmin(user)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) {
    if (isSuperAdmin(user)) return <Navigate to="/super-admin" replace />;
    return <Navigate to={isAdmin(user) ? '/admin' : '/'} replace />;
  }
  return children;
}
