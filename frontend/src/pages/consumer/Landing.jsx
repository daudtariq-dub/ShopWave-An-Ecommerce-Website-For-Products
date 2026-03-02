import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';
import heroAnimation from '../../assets/pay-per-click-digital-marketing.json';

/* SVG category icons — professional, consistent */
const CATEGORIES = [
  {
    label: 'Electronics', slug: 'electronics',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Clothing', slug: 'clothing',
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l3-4h12l3 4-3 1v11H6V9L3 8z" />
      </svg>
    ),
  },
  {
    label: 'Home', slug: 'home',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Sports', slug: 'sports',
    color: 'bg-green-50 text-green-600 border-green-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={1.75} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2a10 10 0 010 20M2 12h20M12 2c-3 3-4 7-4 10s1 7 4 10M12 2c3 3 4 7 4 10s-1 7-4 10" />
      </svg>
    ),
  },
  {
    label: 'Books', slug: 'books',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Beauty', slug: 'beauty',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
  {
    label: 'Jewelry', slug: 'jewelery',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3H5l-2 6h18l-2-6h-4m-6 0l-1 6m7-6l1 6M3 9l9 13 9-13" />
      </svg>
    ),
  },
  {
    label: 'Toys', slug: 'toys',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const TRUST = [
  {
    label: 'Free Shipping',
    sub: 'On all orders over $50',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: '30-Day Returns',
    sub: 'Hassle-free return policy',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Secure Checkout',
    sub: '256-bit SSL encryption',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    label: '24/7 Support',
    sub: 'Always here to help you',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-600',
  },
];

const DEMO_PRODUCTS = [
  { id: 'd1', title: 'Wireless Noise-Cancelling Headphones', price: 89.99, category: 'electronics', image: null, rating: { rate: 4.5, count: 312 }, stock: 18 },
  { id: 'd2', title: 'Men\'s Classic Fit Oxford Shirt', price: 34.95, category: 'clothing', image: null, rating: { rate: 4.2, count: 87 }, stock: 5 },
  { id: 'd3', title: 'Stainless Steel Water Bottle 32oz', price: 24.99, category: 'home', image: null, rating: { rate: 4.7, count: 1204 }, stock: 42 },
  { id: 'd4', title: 'Adjustable Dumbbell Set 20kg', price: 119.00, category: 'sports', image: null, rating: { rate: 4.4, count: 563 }, stock: 0 },
  { id: 'd5', title: 'The Art of Clean Code — Paperback', price: 19.99, category: 'books', image: null, rating: { rate: 4.8, count: 228 }, stock: 3 },
  { id: 'd6', title: 'Vitamin C Brightening Serum 30ml', price: 42.50, category: 'beauty', image: null, rating: { rate: 4.3, count: 715 }, stock: 27 },
  { id: 'd7', title: 'Gold-Plated Hoop Earrings Set', price: 67.00, category: 'jewelery', image: null, rating: { rate: 4.1, count: 91 }, stock: 11 },
  { id: 'd8', title: 'LEGO Architecture City Kit 480pcs', price: 54.95, category: 'toys', image: null, rating: { rate: 4.9, count: 442 }, stock: 8 },
];

export default function Landing() {
  const { products, loading, error, fetchProducts } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ limit: 8 });
  }, [fetchProducts]);

  const displayProducts = products.length > 0 ? products : DEMO_PRODUCTS;

  return (
    <div className="flex flex-col gap-20">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 py-8 md:py-12">
        <div className="flex-1 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full w-fit tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              New arrivals every week
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Shop smarter,<br />
              <span className="text-indigo-600">live better.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg">
              Discover millions of products across every category — curated, priced fairly, and delivered fast.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/category/all')}
              className="px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm hover:shadow-md text-sm"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-7 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
            >
              Browse All
            </button>
          </div>

          <div className="flex items-center gap-8 pt-1">
            {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.9', 'Rating']].map(([val, label]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-gray-900">{val}</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-indigo-50 rounded-3xl" style={{transform:'rotate(3deg)'}} />
            <div className="relative bg-white rounded-3xl border border-gray-200 card-shadow p-6">
              <Lottie animationData={heroAnimation} loop className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5">Browse</p>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <Link to="/category/all" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            All categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 ${cat.color} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-indigo-600 transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products Carousel ────────────────── */}
      <section className="overflow-hidden">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5">Curated picks</p>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link to="/category/all" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Infinite scroll strip — pauses on hover */}
        <div className="relative">
          {/* Left fade edge */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
          {/* Right fade edge */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-gray-50 to-transparent" />

          <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
            {/* Duplicate the list for a seamless infinite loop */}
            {[...displayProducts, ...displayProducts].map((product, i) => (
              <div key={`${product.id}-${i}`} className="w-60 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ───────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 card-shadow overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {TRUST.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-7">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
