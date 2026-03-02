import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
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
                  <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.title}</h1>
              {product.brand && <p className="text-sm text-gray-500">by <span className="font-medium">{product.brand}</span></p>}

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor" viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
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
            <div className="text-sm text-gray-500">
              {product.rating ? (
                <p>
                  Average rating: <strong>{product.rating.rate}/5</strong> based on {product.rating.count} reviews.
                </p>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
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
