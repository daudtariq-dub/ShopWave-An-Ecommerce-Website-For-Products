import { Menu, ShoppingCart, LogOut } from 'lucide-react';
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
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800 text-lg">ShopWave</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5" />
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
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </header>
  );
}
