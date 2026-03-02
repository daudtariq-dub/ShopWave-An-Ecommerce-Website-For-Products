import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';
import HighlightedText from './HighlightedText';
import StockBadge from '../product/StockBadge';
import { formatPrice } from '../../utils/helpers';

const PLACEHOLDER = 'https://placehold.co/200x200/f3f4f6/9ca3af?text=Product';

export default function SearchResultCard({ hit }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl card-shadow border border-gray-200 hover:card-shadow-hover transition-shadow flex flex-col overflow-hidden">
      <div className="cursor-pointer" onClick={() => navigate(`/product/${hit.id}`)}>
        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={hit.image || PLACEHOLDER}
            alt={hit.title}
            className="w-full h-full object-contain p-4"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
        </div>
        <div className="p-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-indigo-600 capitalize">{hit.category}</span>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            <HighlightedText
              html={hit._highlight?.title}
              fallback={hit.title}
              className="[&_mark]:bg-yellow-100 [&_mark]:text-gray-900 [&_mark]:rounded [&_mark]:px-0.5"
            />
          </h3>
          {hit._highlight?.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              <HighlightedText
                html={hit._highlight.description}
                fallback={hit.description}
                className="[&_mark]:bg-yellow-100 [&_mark]:text-gray-900"
              />
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900">{formatPrice(hit.price)}</span>
          <StockBadge stock={hit.stock} size="xs" />
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={hit.stock === 0}
          onClick={() => addToCart(hit)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
