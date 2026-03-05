import { useNavigate } from 'react-router-dom';
import { Star, Plus, Store } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice, truncateText } from '../../utils/helpers';
import { getStockStatus } from '../../utils/stockHelpers';
import { toast } from 'react-toastify';

const PLACEHOLDER = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Product';

function StarRating({ rate = 0, count }) {
  const full = Math.round(rate);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < full ? '#fbbf24' : 'none'}
            color={i < full ? '#fbbf24' : '#d1d5db'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product, className = '' }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { id, title, price, category, image, rating, stock, storeName } = product;
  const stockStatus = getStockStatus(stock);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!stockStatus.canAdd) return;
    addToCart(product);
    toast.success(`Added to cart`);
  };

  return (
    <div
      className={`group bg-white rounded-2xl border border-gray-200 card-shadow hover:card-shadow-hover transition-all duration-250 flex flex-col overflow-hidden cursor-pointer ${className}`}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square flex-shrink-0">
        <img
          src={image || PLACEHOLDER}
          alt={title}
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full capitalize">
          {category}
        </span>
        {/* Store badge */}
        {storeName && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white/90 border border-gray-200 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm">
            <Store className="w-3 h-3 text-gray-400" />
            {truncateText(storeName, 14)}
          </span>
        )}
        {!stockStatus.canAdd && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content — flex-1 so all cards stretch equally */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {rating && <StarRating rate={rating.rate} count={rating.count} />}

        {!stockStatus.isUnknown && stock !== null && stock <= 5 && stock > 0 && (
          <span className="text-xs font-medium text-amber-600">Only {stock} left</span>
        )}

        {/* Price + button pinned to bottom */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.canAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl
              hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150 shadow-sm hover:shadow"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
