import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ChevronDown, ClipboardList, User, LogOut, Menu, X,
  Monitor, Shirt, Home, Dumbbell, BookOpen, Sparkles, Gem, Smile,
  ChevronLeft, ChevronRight, LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CartBadge from '../cart/CartBadge';
import CartDrawer from '../cart/CartDrawer';
import SearchBar from '../ui/extended/SearchBar';

const CATEGORIES = [
  { label: 'All Products', slug: null,        to: '/products',              icon: LayoutGrid, iconColor: 'text-gray-600',   bgColor: 'bg-gray-100' },
  { label: 'Electronics',  slug: 'electronics', to: '/category/electronics', icon: Monitor,    iconColor: 'text-blue-600',   bgColor: 'bg-blue-50' },
  { label: 'Clothing',     slug: 'clothing',    to: '/category/clothing',    icon: Shirt,      iconColor: 'text-pink-600',   bgColor: 'bg-pink-50' },
  { label: 'Home',         slug: 'home',        to: '/category/home',        icon: Home,       iconColor: 'text-amber-600',  bgColor: 'bg-amber-50' },
  { label: 'Sports',       slug: 'sports',      to: '/category/sports',      icon: Dumbbell,   iconColor: 'text-green-600',  bgColor: 'bg-green-50' },
  { label: 'Books',        slug: 'books',       to: '/category/books',       icon: BookOpen,   iconColor: 'text-violet-600', bgColor: 'bg-violet-50' },
  { label: 'Beauty',       slug: 'beauty',      to: '/category/beauty',      icon: Sparkles,   iconColor: 'text-rose-600',   bgColor: 'bg-rose-50' },
  { label: 'Jewelry',      slug: 'jewelery',    to: '/category/jewelery',    icon: Gem,        iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { label: 'Toys',         slug: 'toys',        to: '/category/toys',        icon: Smile,      iconColor: 'text-orange-600', bgColor: 'bg-orange-50' },
];

/* ─── Category Sidebar ────────────────────────────────────────────── */
function CategorySidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cat_sidebar_collapsed')) ?? false; } catch { return false; }
  });

  const toggle = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem('cat_sidebar_collapsed', JSON.stringify(next));
      return next;
    });
  };

  const sidebar = (
    <div
      className={`
        flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-52'}
      `}
    >
      {/* header spacer */}
      <div className="h-3 flex-shrink-0" />

      {/* Category links */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {!collapsed && (
          <p className="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Browse</p>
        )}
        <ul className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <li key={cat.to}>
                <NavLink
                  to={cat.to}
                  end={cat.slug === null}
                  onClick={onMobileClose}
                  title={collapsed ? cat.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-150 group
                    ${isActive
                      ? 'bg-indigo-50 ring-1 ring-indigo-100'
                      : 'hover:bg-gray-50'
                    }
                    ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                        ${isActive ? cat.bgColor : 'bg-gray-100 group-hover:' + cat.bgColor}`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? cat.iconColor : 'text-gray-500 group-hover:' + cat.iconColor}`} />
                      </span>
                      {!collapsed && (
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {cat.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-100 p-2 flex-shrink-0">
        <button
          onClick={toggle}
          className={`flex items-center gap-2 w-full px-2 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 flex-shrink-0" />
            : <>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <span>Collapse</span>
              </>
          }
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] self-start overflow-hidden">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-gray-900/50" onClick={onMobileClose} />
          <aside className="relative z-50 flex flex-shrink-0">
            <div className="flex flex-col h-full w-52 bg-white shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-bold text-indigo-600 text-sm">Categories</span>
                <button onClick={onMobileClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 py-2">
                <ul className="flex flex-col gap-0.5">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <li key={cat.to}>
                        <NavLink
                          to={cat.to}
                          end={cat.slug === null}
                          onClick={onMobileClose}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors
                            ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? cat.bgColor : 'bg-gray-100'}`}>
                                <Icon className={`w-4 h-4 ${isActive ? cat.iconColor : 'text-gray-500'}`} />
                              </span>
                              <span className="text-sm font-medium">{cat.label}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* ─── Top Navbar ──────────────────────────────────────────────────── */
function ConsumerNavbar({ onCartOpen, onSidebarOpen }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-30 flex-shrink-0"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        {/* Hamburger — mobile sidebar trigger */}
        <button
          onClick={onSidebarOpen}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors lg:hidden flex-shrink-0"
          aria-label="Open categories"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="font-bold text-xl text-indigo-600 flex-shrink-0 tracking-tight">
          ShopWave
        </Link>

        {/* Search — centred on desktop */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-lg hidden sm:block">
            <SearchBar />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <CartBadge onClick={onCartOpen} />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setAccountMenuOpen(false), 150)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold text-xs">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name ?? user?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link to="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <ClipboardList className="w-4 h-4 text-gray-400" /> My Orders
                  </Link>
                  <Link to="/account/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4 text-gray-400" /> Profile
                  </Link>
                  <div className="border-t border-gray-100">
                    <button onClick={logout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">ShopWave</h3>
            <p className="text-sm text-gray-500">Your one-stop shop for everything you need.</p>
          </div>
          {[
            { title: 'Shop', links: [{ label: 'Electronics', to: '/category/electronics' }, { label: 'Clothing', to: '/category/clothing' }, { label: 'Home', to: '/category/home' }, { label: 'Sports', to: '/category/sports' }] },
            { title: 'Account', links: [{ label: 'Sign In', to: '/login' }, { label: 'Register', to: '/register' }, { label: 'Orders', to: '/account/orders' }, { label: 'Profile', to: '/account/profile' }] },
            { title: 'Support', links: [{ label: 'Help Center', to: '/support/help-center' }, { label: 'Returns', to: '/support/returns' }, { label: 'Contact Us', to: '/support/contact-us' }, { label: 'FAQ', to: '/support/faq' }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ShopWave. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ─── Root Layout ─────────────────────────────────────────────────── */
export default function ConsumerLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ConsumerNavbar
        onCartOpen={() => setCartOpen(true)}
        onSidebarOpen={() => setMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <CategorySidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
