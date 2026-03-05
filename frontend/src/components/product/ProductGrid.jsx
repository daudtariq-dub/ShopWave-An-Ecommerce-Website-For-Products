import { AlertTriangle, Package } from 'lucide-react';
import ProductCard from './ProductCard';
import Loader from '../ui/Loader';

export default function ProductGrid({ products = [], loading = false, error = null }) {
  if (loading) return <Loader text="Loading products..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-700 font-medium">Failed to load products</p>
        <p className="text-gray-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-700 font-medium">No products found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} className="h-full" />
      ))}
    </div>
  );
}
