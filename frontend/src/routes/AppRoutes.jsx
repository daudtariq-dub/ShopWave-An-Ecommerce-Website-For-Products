import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// Layouts
import ConsumerLayout from '../components/layout/ConsumerLayout';
import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Route guards
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from '../components/auth/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OAuthCallback from '../pages/auth/OAuthCallback';

// Consumer pages
import Landing from '../pages/consumer/Landing';
import CategoryListing from '../pages/consumer/CategoryListing';
import SearchResultsPage from '../pages/consumer/SearchResultsPage';
import ProductDetail from '../pages/consumer/ProductDetail';
import Cart from '../pages/consumer/Cart';
import Checkout from '../pages/consumer/Checkout';
import OrderConfirmation from '../pages/consumer/OrderConfirmation';
import OrderHistory from '../pages/consumer/OrderHistory';
import Profile from '../pages/consumer/Profile';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminInventory from '../pages/admin/AdminInventory';
import AdminOrders from '../pages/admin/AdminOrders';

/**
 * AppBridge lives inside all providers and watches auth state changes.
 * When the user logs in, it triggers guest cart → server cart merge.
 */
function AppBridge() {
  const { isAuthenticated } = useContext(AuthContext);
  const { mergeGuestCart, items } = useContext(CartContext);

  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart(items);
    }
  }, [isAuthenticated]); // eslint-disable-line

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <AppBridge />
      <Routes>
        {/* ── Auth routes ──────────────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        </Route>
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* ── Consumer routes ───────────────────────────── */}
        <Route element={<ConsumerLayout />}>
          <Route index element={<Landing />} />
          <Route path="/category/:slug" element={<CategoryListing />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected consumer routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* ── Admin routes ──────────────────────────────── */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        {/* Legacy admin redirects */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
