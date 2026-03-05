import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/helpers';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { order, loading, fetchOrderById } = useOrders();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id]); // eslint-disable-line

  if (loading) return <Loader text="Loading order..." />;

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center gap-8 py-16 text-center">
      <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center">
        <Check className="w-12 h-12 text-green-500" strokeWidth={2.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your order has been placed.</p>
        {id && (
          <p className="text-sm text-gray-400 font-mono">Order #{id}</p>
        )}
      </div>

      {order && (
        <div className="w-full bg-white rounded-2xl card-shadow border border-gray-200 p-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-700">{item.title ?? item.name} ×{item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          {order.total && (
            <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100 mt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link to="/account/orders" className="flex-1">
          <Button variant="outline" fullWidth>View My Orders</Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button variant="primary" fullWidth>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
