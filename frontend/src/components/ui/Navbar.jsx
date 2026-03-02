import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

export default function Navbar({ onMenuClick }) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-gray-800 text-lg">ShopWave</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-100 rounded-xl flex items-center justify-center">
            <span className="text-indigo-700 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.name ?? user?.email ?? 'User'}
          </span>
        </div>

        <Button variant="ghost" size="sm" onClick={logout}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </header>
  );
}
