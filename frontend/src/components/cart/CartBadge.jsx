import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function CartBadge({ onClick }) {
  const { totalItems } = useCart();
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
      aria-label={`Cart (${totalItems} items)`}
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
