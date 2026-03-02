import { useNavigate } from 'react-router-dom';
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
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < full ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { id, title, price, category, image, rating, stock } = product;
  const stockStatus = getStockStatus(stock);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!stockStatus.canAdd) return;
    addToCart(product);
    toast.success(`Added to cart`);
  };

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 card-shadow hover:card-shadow-hover transition-all duration-250 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={image || PLACEHOLDER}
          alt={title}
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        {/* Category pill — floats over image */}
        <span className="absolute top-3 left-3 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full capitalize">
          {category}
        </span>
        {/* Out of stock overlay */}
        {!stockStatus.canAdd && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {truncateText(title, 70)}
        </h3>

        {rating && <StarRating rate={rating.rate} count={rating.count} />}

        {!stockStatus.isUnknown && stock !== null && stock <= 5 && stock > 0 && (
          <span className="text-xs font-medium text-amber-600">Only {stock} left</span>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.canAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl
              hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150 shadow-sm hover:shadow"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
