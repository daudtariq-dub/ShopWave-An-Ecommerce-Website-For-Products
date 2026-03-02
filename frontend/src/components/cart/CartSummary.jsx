import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/helpers';
import { hasStockIssues } from '../../utils/stockHelpers';

export default function CartSummary({ onClose }) {
  const { items, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const total = totalPrice + tax + shipping;
  const stockIssues = hasStockIssues(items);

  const handleCheckout = () => {
    if (onClose) onClose();
    if (!isAuthenticated) {
      navigate('/login?returnTo=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 border-t border-gray-100">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>

      {stockIssues && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
          Some items exceed available stock. Please adjust quantities.
        </p>
      )}

      {totalPrice > 0 && totalPrice < 50 && (
        <p className="text-xs text-gray-500 text-center">
          Add {formatPrice(50 - totalPrice)} more for free shipping.
        </p>
      )}

      <Button variant="primary" fullWidth disabled={stockIssues || items.length === 0} onClick={handleCheckout}>
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      </Button>
    </div>
  );
}
