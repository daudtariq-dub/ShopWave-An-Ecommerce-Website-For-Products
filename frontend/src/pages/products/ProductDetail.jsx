import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
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
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(rating.rate) ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
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
