import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import StockBadge from '../product/StockBadge';

const PLACEHOLDER = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=Item';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const stockExceeded = item.stock !== null && item.stock !== undefined && item.quantity > item.stock;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
        <img
          src={item.image || PLACEHOLDER}
          alt={item.title}
          className="w-full h-full object-contain p-2"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{item.title}</p>
          <button
            onClick={() => removeFromCart(item.id)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <span className="text-xs text-indigo-600 capitalize">{item.category}</span>

        {stockExceeded && (
          <StockBadge stock={item.stock} size="xs" />
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.stock !== null && item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 text-sm font-medium"
            >
              +
            </button>
          </div>
          <span className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
