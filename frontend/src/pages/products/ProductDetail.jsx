import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatPrice } from '../../utils/helpers';

const PLACEHOLDER_IMG = 'https://placehold.co/600x500/f3f4f6/9ca3af?text=Product';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, fetchProductById } = useProducts();
  const { addToCart, items } = useCart();

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id, fetchProductById]);

  const cartItem = items.find((item) => item.id === product?.id);

  if (loading) return <Loader text="Loading product..." />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-700 font-medium">{error || 'Product not found'}</p>
        <Button variant="outline" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const { title, price, category, image, description, rating } = product;

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <Card padding={false} className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-10 min-h-[300px]">
            <img
              src={image || PLACEHOLDER_IMG}
              alt={title}
              className="max-h-80 max-w-full object-contain"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
            />
          </div>

          <div className="md:w-3/5 p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit capitalize">
                {category}
              </span>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{title}</h1>

              {rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < Math.round(rating.rate) ? '#fbbf24' : 'none'}
                        color={i < Math.round(rating.rate) ? '#fbbf24' : '#d1d5db'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {rating.rate} ({rating.count} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>

              <div className="flex gap-3 ml-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItem ? `Add Again (${cartItem.quantity} in cart)` : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
