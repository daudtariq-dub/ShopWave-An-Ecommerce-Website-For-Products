import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';

export default function Cart() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        </div>
        <Link to="/">
          <Button variant="primary" size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Items */}
        <div className="flex-1 bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-2 divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
          <div className="px-5 pt-5">
            <h2 className="font-semibold text-gray-900 text-base">Order Summary</h2>
          </div>
          <CartSummary />
        </div>
      </div>

      <div>
        <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
