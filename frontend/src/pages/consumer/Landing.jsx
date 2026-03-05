import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import {
  Monitor, Shirt, Home, Dumbbell, BookOpen, Sparkles, Gem, Smile,
  Truck, RotateCcw, ShieldCheck, Headphones, ChevronRight,
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';
import heroAnimation from '../../assets/pay-per-click-digital-marketing.json';

const CATEGORIES = [
  { label: 'Electronics', slug: 'electronics', color: 'bg-blue-50 text-blue-600 border-blue-100',   icon: <Monitor className="w-6 h-6" /> },
  { label: 'Clothing',    slug: 'clothing',    color: 'bg-pink-50 text-pink-600 border-pink-100',   icon: <Shirt className="w-6 h-6" /> },
  { label: 'Home',        slug: 'home',        color: 'bg-amber-50 text-amber-600 border-amber-100',icon: <Home className="w-6 h-6" /> },
  { label: 'Sports',      slug: 'sports',      color: 'bg-green-50 text-green-600 border-green-100',icon: <Dumbbell className="w-6 h-6" /> },
  { label: 'Books',       slug: 'books',       color: 'bg-violet-50 text-violet-600 border-violet-100', icon: <BookOpen className="w-6 h-6" /> },
  { label: 'Beauty',      slug: 'beauty',      color: 'bg-rose-50 text-rose-600 border-rose-100',   icon: <Sparkles className="w-6 h-6" /> },
  { label: 'Jewelry',     slug: 'jewelery',    color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Gem className="w-6 h-6" /> },
  { label: 'Toys',        slug: 'toys',        color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Smile className="w-6 h-6" /> },
];

const TRUST = [
  { label: 'Free Shipping',   sub: 'On all orders over $50',   icon: <Truck className="w-6 h-6" />,       color: 'bg-blue-50 text-blue-600' },
  { label: '30-Day Returns',  sub: 'Hassle-free return policy', icon: <RotateCcw className="w-6 h-6" />,   color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Secure Checkout', sub: '256-bit SSL encryption',    icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600' },
  { label: '24/7 Support',    sub: 'Always here to help you',   icon: <Headphones className="w-6 h-6" />,  color: 'bg-amber-50 text-amber-600' },
];

const DEMO_PRODUCTS = [
  { id: 'd1', title: 'Wireless Noise-Cancelling Headphones', price: 89.99, category: 'electronics', image: null, rating: { rate: 4.5, count: 312 }, stock: 18 },
  { id: 'd2', title: "Men's Classic Fit Oxford Shirt",       price: 34.95, category: 'clothing',    image: null, rating: { rate: 4.2, count: 87  }, stock: 5  },
  { id: 'd3', title: 'Stainless Steel Water Bottle 32oz',    price: 24.99, category: 'home',        image: null, rating: { rate: 4.7, count: 1204 }, stock: 42 },
  { id: 'd4', title: 'Adjustable Dumbbell Set 20kg',         price: 119.00,category: 'sports',      image: null, rating: { rate: 4.4, count: 563 }, stock: 0  },
  { id: 'd5', title: 'The Art of Clean Code — Paperback',    price: 19.99, category: 'books',       image: null, rating: { rate: 4.8, count: 228 }, stock: 3  },
  { id: 'd6', title: 'Vitamin C Brightening Serum 30ml',     price: 42.50, category: 'beauty',      image: null, rating: { rate: 4.3, count: 715 }, stock: 27 },
  { id: 'd7', title: 'Gold-Plated Hoop Earrings Set',        price: 67.00, category: 'jewelery',    image: null, rating: { rate: 4.1, count: 91  }, stock: 11 },
  { id: 'd8', title: 'LEGO Architecture City Kit 480pcs',    price: 54.95, category: 'toys',        image: null, rating: { rate: 4.9, count: 442 }, stock: 8  },
];

export default function Landing() {
  const { products, loading, error, fetchProducts } = useProducts();
  const navigate = useNavigate();

  useEffect(() => { fetchProducts({ limit: 8 }); }, [fetchProducts]);

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
            <div className="absolute inset-0 bg-indigo-50 rounded-3xl" style={{ transform: 'rotate(3deg)' }} />
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
            <ChevronRight className="w-4 h-4" />
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
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-gray-50 to-transparent" />
          <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused] items-stretch">
            {[...displayProducts, ...displayProducts].map((product, i) => (
              <div key={`${product.id}-${i}`} className="w-60 flex-shrink-0 flex">
                <ProductCard product={product} className="flex-1" />
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
