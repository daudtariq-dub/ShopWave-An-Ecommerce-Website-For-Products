import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { isAdmin } from '../../utils/helpers';
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
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
