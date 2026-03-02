import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CartBadge from '../cart/CartBadge';
import CartDrawer from '../cart/CartDrawer';
import SearchBar from '../ui/extended/SearchBar';

const CATEGORY_NAV = [
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Clothing', slug: 'clothing' },
  { label: 'Home', slug: 'home' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Books', slug: 'books' },
];

function ConsumerNavbar({ onCartOpen }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30" style={{boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-indigo-600 flex-shrink-0 tracking-tight">
          ShopWave
        </Link>

        {/* Search — hidden on very small screens */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
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
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name ?? user?.email}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link to="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </Link>
                  <Link to="/account/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Portal
                    </Link>
                  )}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* Category nav */}
      <nav className="hidden lg:flex items-center gap-0 px-6 border-t border-gray-100 overflow-x-auto">
        {CATEGORY_NAV.map((cat) => (
          <NavLink
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-600 border-transparent hover:text-indigo-600'
              }`
            }
          >
            {cat.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 px-4 py-2">
          {CATEGORY_NAV.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-sm text-gray-700 hover:text-indigo-600"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">EcomWeb</h3>
            <p className="text-sm text-gray-500">Your one-stop shop for everything you need.</p>
          </div>
          {[
            { title: 'Shop', links: ['Electronics', 'Clothing', 'Home', 'Sports'] },
            { title: 'Account', links: ['Sign In', 'Register', 'Orders', 'Profile'] },
            { title: 'Support', links: ['Help Center', 'Returns', 'Contact Us', 'FAQ'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} EcomWeb. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function ConsumerLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ConsumerNavbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
