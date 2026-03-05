import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Drawer from '../ui/extended/Drawer';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';

export default function CartDrawer({ open, onClose }) {
  const { items, clearCart } = useCart();

  return (
    <Drawer open={open} onClose={onClose} title={`Cart (${items.length})`} side="right" width="w-full sm:w-[420px]">
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1">Start shopping to add items.</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <Link to="/category/all" onClick={onClose}>Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="flex-shrink-0">
              <div className="px-5 py-2 border-t border-gray-100">
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Clear cart
                </button>
              </div>
              <CartSummary onClose={onClose} />
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
