import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// Layouts
import ConsumerLayout from '../components/layout/ConsumerLayout';
import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';
import SuperAdminLayout from '../components/layout/SuperAdminLayout';

// Route guards
import { ProtectedRoute, AdminRoute, ConsumerRoute, PublicOnlyRoute, SuperAdminRoute } from '../components/auth/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OAuthCallback from '../pages/auth/OAuthCallback';
import ForgotPassword from '../pages/auth/ForgotPassword';

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
import SupportPage from '../pages/misc/SupportPage';
import ProductsPage from '../pages/products/Products';
import LegacyProductDetail from '../pages/products/ProductDetail';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminInventory from '../pages/admin/AdminInventory';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProfile from '../pages/admin/AdminProfile';

// Super Admin pages
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard';
import SuperAdminStores from '../pages/super-admin/SuperAdminStores';
import SuperAdminStoreForm from '../pages/super-admin/SuperAdminStoreForm';
import SuperAdminUsers from '../pages/super-admin/SuperAdminUsers';
import SuperAdminUserDetails from '../pages/super-admin/SuperAdminUserDetails';
import SuperAdminCategories from '../pages/super-admin/SuperAdminCategories';

function AppBridge() {
  const { isAuthenticated } = useContext(AuthContext);
  const { mergeGuestCart, items } = useContext(CartContext);
  // Track whether this is the initial mount. On page refresh, isAuthenticated
  // flips false→true because auth loads from localStorage — that is NOT a fresh
  // login and must not trigger a merge (CartContext already loads the server cart
  // on mount via cartApi.getCart()). Only subsequent true→true transitions
  // (i.e. actual login events handled by useAuth) need the merge, and useAuth
  // already calls mergeGuestCart directly, so AppBridge no longer needs to.
  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return; // skip on initial mount / page refresh
    }
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
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        </Route>
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* ── Consumer routes ───────────────────────────── */}
        <Route element={<ConsumerRoute><ConsumerLayout /></ConsumerRoute>}>
          <Route index element={<Landing />} />
          <Route path="/category/:slug" element={<CategoryListing />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<LegacyProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/support/:slug" element={<SupportPage />} />

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
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* ── Super Admin routes ────────────────────────── */}
        <Route element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/stores" element={<SuperAdminStores />} />
          <Route path="/super-admin/stores/new" element={<SuperAdminStoreForm />} />
          <Route path="/super-admin/stores/:id/edit" element={<SuperAdminStoreForm />} />
          <Route path="/super-admin/users" element={<SuperAdminUsers />} />
          <Route path="/super-admin/users/:id" element={<SuperAdminUserDetails />} />
          <Route path="/super-admin/categories" element={<SuperAdminCategories />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
