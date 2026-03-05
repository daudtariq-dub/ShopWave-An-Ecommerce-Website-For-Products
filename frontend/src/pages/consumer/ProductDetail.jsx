import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Heart, ShoppingCart, Star } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import ImageGallery from '../../components/product/ImageGallery';
import StockBadge from '../../components/product/StockBadge';
import ProductBreadcrumb from '../../components/product/ProductBreadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';
import { getStockStatus, clampQty } from '../../utils/stockHelpers';
import { toast } from 'react-toastify';
import ReviewSection from '../../components/product/ReviewSection';

const TABS = ['Description', 'Specifications', 'Reviews'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, products: related, loading, error, fetchProductById, fetchProducts } = useProducts();
  const { addToCart, items } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProducts({ limit: 4, category: product?.category });
    }
    setQty(1);
  }, [id]); // eslint-disable-line

  const stock = product?.stock ?? product?.stockQuantity ?? null;
  const stockStatus = getStockStatus(stock);
  const images = product?.images ?? (product?.image ? [product.image] : []);
  const cartItem = items.find((i) => i.id === product?.id);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, qty);
    toast.success(`${qty > 1 ? `${qty}× ` : ''}${product.title} added to cart`);
  }, [product, qty, addToCart]);

  const adjustQty = (delta) => {
    setQty((prev) => {
      const next = prev + delta;
      const maxQty = stock !== null ? stock : 99;
      return Math.max(1, Math.min(next, maxQty));
    });
  };

  if (loading && !product) return <Loader text="Loading product..." />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="font-medium text-gray-900">Product not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: product.category ?? 'Products', href: `/category/${product.category ?? 'all'}` },
    { label: product.title },
  ];

  return (
    <div className="flex flex-col gap-10">
      <ProductBreadcrumb crumbs={crumbs} />

      <div className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Images */}
          <div className="md:w-2/5 p-6 bg-gray-50">
            <ImageGallery images={images} alt={product.title} />
          </div>

          {/* Info */}
          <div className="md:w-3/5 p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full capitalize">
                  {product.category}
                </span>
                <button
                  onClick={() => setWishlisted((v) => !v)}
                  className={`p-2 rounded-xl transition-colors ${wishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.title}</h1>
              {product.brand && <p className="text-sm text-gray-500">by <span className="font-medium">{product.brand}</span></p>}

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < Math.round(product.rating.rate) ? '#fbbf24' : 'none'}
                        color={i < Math.round(product.rating.rate) ? '#fbbf24' : '#d1d5db'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{product.rating.rate} · {product.rating.count} reviews</span>
                </div>
              )}
            </div>

            {/* Price + Stock */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-100">
              <div>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <StockBadge stock={stock} />
            </div>

            {/* Qty + Add to cart */}
            <div className="flex flex-col gap-4">
              {stockStatus.canAdd && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => adjustQty(-1)}
                      disabled={qty <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors font-medium"
                    >−</button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900">{qty}</span>
                    <button
                      onClick={() => adjustQty(1)}
                      disabled={stock !== null && qty >= stock}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors font-medium"
                    >+</button>
                  </div>
                  {stock !== null && (
                    <span className="text-xs text-gray-400">{stock} available</span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!stockStatus.canAdd}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!stockStatus.canAdd
                    ? 'Out of Stock'
                    : cartItem
                    ? `Add Again (${cartItem.quantity} in cart)`
                    : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-6 py-4 text-sm font-medium transition-colors border-b-2',
                activeTab === tab
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'Description' && (
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'Specifications' && (
            <div className="text-sm text-gray-500">
              {product.specifications ? (
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <dt className="font-medium text-gray-700 text-xs uppercase tracking-wide">{k}</dt>
                      <dd className="text-gray-600">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          )}
          {activeTab === 'Reviews' && (
            <ReviewSection productId={product.id} />
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">You might also like</h2>
          <ProductGrid products={related.filter((p) => p.id !== product.id).slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
